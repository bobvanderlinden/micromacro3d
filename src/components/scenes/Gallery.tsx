import { ModelGallery } from "../ModelGallery";
import * as buildingUrls from "../../assets/buildings/urls";
import * as roadkitUrls from "../../assets/roadkit/urls";
import { BuildingComponentModel } from "../../assets/buildings";
import { RoadkitModel } from "../../assets/roadkit";

const models = [
  ...Object.values(buildingUrls).map((url) => (props) => (
    <BuildingComponentModel url={url} {...props} />
  )),
  ...Object.values(roadkitUrls).map((url) => (props) => (
    <RoadkitModel url={url} {...props} />
  )),
];

export function Gallery() {
  return <ModelGallery models={models} spacing={1.5} />;
}
