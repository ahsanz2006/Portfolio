import { useEffect, useRef, useState } from "react";
import * as THREE from "three";
import setCharacter from "./utils/character";
import setLighting from "./utils/lighting";
import { useLoading } from "../../context/LoadingProvider";
import handleResize from "./utils/resizeUtils";
import {
  handleMouseMove,
  handleTouchEnd,
  handleHeadRotation,
  handleTouchMove,
} from "./utils/mouseUtils";
import setAnimations from "./utils/animationUtils";
import { setProgress } from "../Loading";

const Scene = () => {
  const canvasDiv = useRef<HTMLDivElement | null>(null);
  const hoverDivRef = useRef<HTMLDivElement>(null);
  const sceneRef = useRef(new THREE.Scene());
  const { setLoading } = useLoading();

  const [character, setChar] = useState<THREE.Object3D | null>(null);
  useEffect(() => {
    if (canvasDiv.current) {
      let rect = canvasDiv.current.getBoundingClientRect();
      let container = { width: rect.width, height: rect.height };
      const aspect = container.width / container.height;
      const scene = sceneRef.current;

      const renderer = new THREE.WebGLRenderer({
        alpha: true,
        antialias: true,
      });
      renderer.setSize(container.width, container.height);
      renderer.setPixelRatio(window.devicePixelRatio);
      renderer.toneMapping = THREE.ACESFilmicToneMapping;
      renderer.toneMappingExposure = 1;
      canvasDiv.current.appendChild(renderer.domElement);

      const camera = new THREE.PerspectiveCamera(14.5, aspect, 0.1, 1000);
      camera.position.z = 10;
      camera.position.set(0, 13.1, 24.7);
      camera.zoom = 1.1;
      camera.updateProjectionMatrix();

      let headBone: THREE.Object3D | null = null;
      let screenLight: any | null = null;
      let mixer: THREE.AnimationMixer;

      const clock = new THREE.Clock();

      const light = setLighting(scene);
      let progress = setProgress((value) => setLoading(value));
      const { loadCharacter } = setCharacter(renderer, scene, camera);

      loadCharacter().then((gltf) => {
        if (gltf) {
          const animations = setAnimations(gltf);
          hoverDivRef.current && animations.hover(gltf, hoverDivRef.current);
          mixer = animations.mixer;
          let character = gltf.scene;
          character.updateMatrixWorld(true);
          const headAnchor = character.getObjectByName("spine006") || null;
          const headWorldY = headAnchor
            ? headAnchor.getWorldPosition(new THREE.Vector3()).y
            : null;
          // Restore original model materials.
          character.traverse((child) => {
            if (child instanceof THREE.Mesh) {
              const mesh = child as THREE.Mesh;
              const name = mesh.name.toLowerCase();
              const originalMaterials = Array.isArray(mesh.material)
                ? mesh.material
                : [mesh.material];
              const materialNames = originalMaterials
                .map((material) => material?.name?.toLowerCase?.() ?? "")
                .join(" ");
              const parentName = mesh.parent?.name?.toLowerCase?.() ?? "";
              const identity = `${name} ${materialNames} ${parentName}`;
              const isShoe = identity.includes("shoe");
              const isClothing =
                identity.includes("cloth") ||
                identity.includes("clothes") ||
                identity.includes("shirt") ||
                identity.includes("pant") ||
                identity.includes("trouser") ||
                identity.includes("jean");
              const isHairOrAccessory =
                identity.includes("hair") ||
                identity.includes("glass") ||
                identity.includes("frame") ||
                identity.includes("eye") ||
                identity.includes("brow") ||
                identity.includes("eyelash") ||
                identity.includes("teeth");
              const isFaceMesh =
                identity.includes("face") ||
                identity.includes("head") ||
                identity.includes("cheek") ||
                identity.includes("jaw") ||
                identity.includes("mouth") ||
                identity.includes("lip");
              const firstMaterialColor = (originalMaterials[0] as any)?.color as
                | THREE.Color
                | undefined;
              const isNearWhiteMaterial =
                !!firstMaterialColor &&
                firstMaterialColor.r > 0.7 &&
                firstMaterialColor.g > 0.7 &&
                firstMaterialColor.b > 0.7;

              let isHeadRegion = false;
              if (headWorldY !== null) {
                const box = new THREE.Box3().setFromObject(mesh);
                const center = box.getCenter(new THREE.Vector3());
                isHeadRegion = center.y >= headWorldY - 2.2;
              }
              const shouldForceFaceTone =
                isHeadRegion &&
                isNearWhiteMaterial &&
                !isClothing &&
                !isHairOrAccessory &&
                !isShoe;

              if (
                identity.includes("skin") ||
                identity.includes("face") ||
                identity.includes("head") ||
                identity.includes("ear") ||
                identity.includes("nose") ||
                identity.includes("neck") ||
                identity.includes("hand") ||
                identity.includes("finger") ||
                shouldForceFaceTone
              ) {
                if (!isClothing && !isHairOrAccessory && !isShoe) {
                  const nextMaterials = originalMaterials.map((material) => {
                    const clonedMaterial = material.clone() as THREE.Material & {
                      color?: THREE.Color;
                      map?: THREE.Texture | null;
                    };
                    clonedMaterial.color?.set("#B08865");
                    if (isFaceMesh || shouldForceFaceTone) {
                      // Face materials often carry a strong texture; disable it so skin tone is visible.
                      clonedMaterial.map = null;
                    }
                    return clonedMaterial;
                  });
                  mesh.material = Array.isArray(mesh.material)
                    ? nextMaterials
                    : nextMaterials[0];
                }
              } else if (isClothing) {
                const nextMaterials = originalMaterials.map((material) => {
                  const clonedMaterial = material.clone() as THREE.Material & {
                    color?: THREE.Color;
                  };
                  clonedMaterial.color?.set("#8EC5FF");
                  return clonedMaterial;
                });
                mesh.material = Array.isArray(mesh.material)
                  ? nextMaterials
                  : nextMaterials[0];
              }
            }
          });
          setChar(character);
          scene.add(character);
          headBone = character.getObjectByName("spine006") || null;
          screenLight = character.getObjectByName("screenlight") || null;
          progress.loaded().then(() => {
            setTimeout(() => {
              light.turnOnLights();
              animations.startIntro();
            }, 2500);
          });
          window.addEventListener("resize", () =>
            handleResize(renderer, camera, canvasDiv, character)
          );
        }
      });

      let mouse = { x: 0, y: 0 },
        interpolation = { x: 0.1, y: 0.2 };

      const onMouseMove = (event: MouseEvent) => {
        handleMouseMove(event, (x, y) => (mouse = { x, y }));
      };
      let debounce: number | undefined;
      const onTouchStart = (event: TouchEvent) => {
        const element = event.target as HTMLElement;
        debounce = setTimeout(() => {
          element?.addEventListener("touchmove", (e: TouchEvent) =>
            handleTouchMove(e, (x, y) => (mouse = { x, y }))
          );
        }, 200);
      };

      const onTouchEnd = () => {
        handleTouchEnd((x, y, interpolationX, interpolationY) => {
          mouse = { x, y };
          interpolation = { x: interpolationX, y: interpolationY };
        });
      };

      document.addEventListener("mousemove", (event) => {
        onMouseMove(event);
      });
      const landingDiv = document.getElementById("landingDiv");
      if (landingDiv) {
        landingDiv.addEventListener("touchstart", onTouchStart);
        landingDiv.addEventListener("touchend", onTouchEnd);
      }
      const animate = () => {
        requestAnimationFrame(animate);
        if (headBone) {
          handleHeadRotation(
            headBone,
            mouse.x,
            mouse.y,
            interpolation.x,
            interpolation.y,
            THREE.MathUtils.lerp
          );
          light.setPointLight(screenLight);
        }
        const delta = clock.getDelta();
        if (mixer) {
          mixer.update(delta);
        }
        renderer.render(scene, camera);
      };
      animate();
      return () => {
        clearTimeout(debounce);
        scene.clear();
        renderer.dispose();
        window.removeEventListener("resize", () =>
          handleResize(renderer, camera, canvasDiv, character!)
        );
        if (canvasDiv.current) {
          canvasDiv.current.removeChild(renderer.domElement);
        }
        if (landingDiv) {
          document.removeEventListener("mousemove", onMouseMove);
          landingDiv.removeEventListener("touchstart", onTouchStart);
          landingDiv.removeEventListener("touchend", onTouchEnd);
        }
      };
    }
  }, []);

  return (
    <>
      <div className="character-container">
        <div className="character-model" ref={canvasDiv}>
          <div className="character-rim"></div>
          <div className="character-hover" ref={hoverDivRef}></div>
        </div>
      </div>
    </>
  );
};

export default Scene;
