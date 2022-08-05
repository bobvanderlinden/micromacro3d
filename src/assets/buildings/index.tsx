import {
  modularBuilding029 as asset29Url,
  modularBuilding030 as asset30Url,
  modularBuilding031 as asset31Url,
  modularBuilding033 as asset33Url,
  modularBuilding034 as asset34Url,
  modularBuilding035 as asset35Url,
  modularBuilding053 as asset53Url,
  modularBuilding054 as asset54Url,
  modularBuilding055 as asset55Url,
  modularBuilding065 as asset65Url,
  modularBuilding069 as asset69Url,
} from "./urls";
import { Model } from "../../components/Model";

export function BuildingComponentModel({ url, ...props }) {
  return (
    <group {...props}>
      <Model url={url} position={[0.5, 0, -0.5]} rotation={[0, Math.PI, 0]} />
    </group>
  );
}

export function BuildingTopFlat(props) {
  return <BuildingComponentModel url={asset31Url} {...props} />;
}

export function BuildingTopTriangle(props) {
  return <BuildingComponentModel url={asset65Url} {...props} />;
}

export const buildingTops = [BuildingTopFlat, BuildingTopTriangle];

export function BuildingMiddle29(props) {
  return <BuildingComponentModel url={asset29Url} {...props} />;
}
export function BuildingMiddle30(props) {
  return <BuildingComponentModel url={asset30Url} {...props} />;
}
export function BuildingMiddle33(props) {
  return <BuildingComponentModel url={asset33Url} {...props} />;
}
export function BuildingMiddle34(props) {
  return <BuildingComponentModel url={asset34Url} {...props} />;
}
export function BuildingMiddle35(props) {
  return <BuildingComponentModel url={asset35Url} {...props} />;
}

export const buildingMiddles = [
  BuildingMiddle29,
  BuildingMiddle30,
  BuildingMiddle33,
  BuildingMiddle34,
  BuildingMiddle35,
];

export function BuildingBottom53(props) {
  return <BuildingComponentModel url={asset53Url} {...props} />;
}
export function BuildingBottom54(props) {
  return <BuildingComponentModel url={asset54Url} {...props} />;
}
export function BuildingBottom55(props) {
  return <BuildingComponentModel url={asset55Url} {...props} />;
}
export function BuildingBottom69(props) {
  return <BuildingComponentModel url={asset69Url} {...props} />;
}

export const buildingBottoms = [
  BuildingBottom69,
  BuildingBottom53,
  BuildingBottom54,
  BuildingBottom55,
];
