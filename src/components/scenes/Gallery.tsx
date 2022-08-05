import { ModelGallery } from "../ModelGallery";

const roadTileUrls = Object.entries({
  ...import.meta.glob("../../assets/models/roads/roadTile_*.gltf", {
    as: "url",
    eager: true,
  }),
  ...import.meta.glob("../../assets/models/buildings/*.gltf", {
    as: "url",
    eager: true,
  }),
}).map(([key, value]) => value);

export function Gallery() {
  return <ModelGallery modelUrls={roadTileUrls} />;
}
