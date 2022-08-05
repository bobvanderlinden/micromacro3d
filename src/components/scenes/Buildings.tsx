import { range } from "lodash";
import { Vector3 } from "three";
import {
  buildingBottoms,
  buildingMiddles,
  buildingTops,
} from "../../assets/buildings";
import { ModelGallery } from "../ModelGallery";

function Building({ Top, Middle, Bottom, size = 0, ...props }) {
  const componentHeight = 0.62;
  return (
    <group {...props}>
      <Top position={new Vector3(0, componentHeight * (1 + size), 0)} />
      {range(0, size).map((_, index) => (
        <Middle
          key={index}
          position={new Vector3(0, componentHeight * (1 + index), 0)}
        />
      ))}
      <Bottom />
    </group>
  );
}

function combinations(obj) {
  return Object.entries(obj).reduce(
    (acc, [key, values]: any) =>
      acc.flatMap((acc) => values.map((value) => ({ ...acc, [key]: value }))),
    [{}]
  );
}

const models = [
  ...combinations({
    size: [0],
    Bottom: buildingBottoms,
    Top: buildingTops,
  }),
  ...combinations({
    size: range(1, 3),
    Middle: buildingMiddles,
    Bottom: buildingBottoms,
    Top: buildingTops,
  }),
].map((buildingProps) => (props) => <Building {...buildingProps} {...props} />);

export function Buildings() {
  return <ModelGallery models={models} spacing={3} />;
}
