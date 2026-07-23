import * as THREE from "three";
import { RGBELoader } from "three-stdlib";
import { gsap } from "gsap";

const setLighting = (scene: THREE.Scene) => {
  // Soft base light so the character is never fully black
  const ambientLight = new THREE.AmbientLight(0x38bdf8, 0.45);
  scene.add(ambientLight);

  // Main front light
  const directionalLight = new THREE.DirectionalLight(0x38bdf8, 0.8);
  directionalLight.position.set(0, 2.5, 4);
  directionalLight.castShadow = true;
  directionalLight.shadow.mapSize.width = 1024;
  directionalLight.shadow.mapSize.height = 1024;
  directionalLight.shadow.camera.near = 0.5;
  directionalLight.shadow.camera.far = 50;
  scene.add(directionalLight);

  // Strong blue rim light defines the character against the dark background.
  const rimLight = new THREE.DirectionalLight(0x0ea5e9, 1.2);
  rimLight.position.set(-3, 2, -4);
  scene.add(rimLight);

  // Point light controlled by screen/emissive object
  const pointLight = new THREE.PointLight(0x38bdf8, 0.8, 100, 3);
  pointLight.position.set(3, 12, 4);
  pointLight.castShadow = true;
  scene.add(pointLight);

  // Front fill light to keep the face/body visible
  const frontFillLight = new THREE.PointLight(0xffffff, 1.2, 20, 2);
  frontFillLight.position.set(0, 2, 4);
  scene.add(frontFillLight);

  new RGBELoader().load(
    `${import.meta.env.BASE_URL}models/char_enviorment.hdr`,
    function (texture) {
      texture.mapping = THREE.EquirectangularReflectionMapping;
      scene.environment = texture;
      scene.environmentIntensity = 0.7;
      scene.environmentRotation.set(5.76, 85.85, 1);
    },
    undefined,
    function (error) {
      console.error("HDR environment failed to load:", error);
    }
  );

  function setPointLight(screenLight: any) {
    if (screenLight?.material?.opacity > 0.9) {
      pointLight.intensity = screenLight.material.emissiveIntensity * 20;
    } else {
      pointLight.intensity = 0.8;
    }
  }

  const duration = 2;
  const ease = "power2.inOut";

  function turnOnLights() {
    gsap.to(scene, {
      environmentIntensity: 1,
      duration,
      ease,
    });

    gsap.to(directionalLight, {
      intensity: 1.8,
      duration,
      ease,
    });

    gsap.to(frontFillLight, {
      intensity: 1.8,
      duration,
      ease,
    });

    gsap.to(rimLight, {
      intensity: 1.6,
      duration,
      ease,
    });

    gsap.to(".character-rim", {
      y: "55%",
      opacity: 1,
      delay: 0.2,
      duration: 2,
    });
  }

  return { setPointLight, turnOnLights };
};

export default setLighting;
