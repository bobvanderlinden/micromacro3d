import { RoadkitModel } from "../../assets/roadkit";
import * as urls from "../../assets/roadkit/urls";
import { useState } from "react";
import { Html } from "@react-three/drei";
import { Gallery } from "../Gallery";
import { BoxGeometry } from "three";
import * as maps from "../../assets/maps";
import {
  Grid,
  CellData,
  TileData,
  Rotation,
  Coords,
  GridData,
} from "../../Grid";
import { start } from "../../waveFunction";

function HoverHighlight({ children, ...props }) {
  const [isHovered, setHovered] = useState(false);
  return (
    <group
      {...props}
      scale={isHovered ? [1.2, 1.2, 1.2] : [1, 1, 1]}
      onPointerEnter={(e) => {
        setHovered(true);
      }}
      onPointerLeave={(e) => {
        setHovered(false);
      }}
    >
      {children}
    </group>
  );
}

function Map({
  grid,
  onCellClick,
}: {
  grid: Grid;
  onCellClick: (args: { x: number; y: number; cell: CellData }) => void;
}) {
  return (
    <group>
      {Array.from(grid, ({ x, y, cell }, index) => (
        <HoverHighlight
          key={index}
          position={[x, 0, y]}
          onClick={(e) => {
            e.stopPropagation();
            onCellClick({ x, y, cell });
          }}
        >
          <Cell data={cell} />
        </HoverHighlight>
      ))}
    </group>
  );
}

function Cell({ data }: { data: CellData }) {
  return (
    <RoadkitModel
      url={urls[data.tile.name]}
      rotation={[0, data.rotation * Math.PI * 0.5, 0]}
    />
  );
}

const tiles = Object.fromEntries(
  Object.entries(urls).map(([name, _]) => [name, { name }])
);

const emptyTile: TileData = tiles.roadTile163;
const emptyCell: CellData = { tile: emptyTile, rotation: 0 };

function Picker({ onChange, ...props }) {
  const [rotation, setRotation] = useState<Rotation>(0);

  return (
    <group {...props}>
      <mesh
        geometry={new BoxGeometry(1, 1, 1)}
        onClick={(e) => {
          e.stopPropagation();
          setRotation((value) => ((value + 1) % 4) as Rotation);
        }}
      >
        <meshBasicMaterial transparent color="#f00" />
      </mesh>
      <Gallery spacing={1.5}>
        {Object.values(tiles).map((tile, index) => (
          <HoverHighlight
            key={index}
            onClick={(e) => {
              onChange({ target: { value: { tile, rotation } } });
            }}
          >
            <Cell key={index} data={{ tile, rotation }} />
          </HoverHighlight>
        ))}
      </Gallery>
    </group>
  );
}

export function Editor() {
  const [state, setState] = useState<null | { selectedCoords: Coords }>(null);
  const [{ name, grid }, setMap] = useState(() => {
    const [name, gridData] = Object.entries(maps)[0];
    return {
      name,
      grid: new Grid(gridData as GridData),
    };
  });
  return (
    <>
      {state?.selectedCoords && (
        <Picker
          position={[0, 2, 0]}
          value={state}
          onChange={(e) => {
            grid.setCell(state.selectedCoords, e.target.value);
            setState(null);
          }}
        />
      )}
      <Map
        grid={grid}
        onCellClick={({ x, y, cell }) => {
          setState({ selectedCoords: [x, y] });
        }}
      />
      <Html
        position={[grid.data.width, 0, 0]}
        rotation-x={-Math.PI / 2}
        rotation-z={Math.PI / 2}
        transform
        occlude
        style={{ position: "absolute", left: 0 }}
      >
        <button
          onClick={(e) => {
            setMap({
              name,
              grid: grid.resize(
                [grid.data.width + 1, grid.data.height],
                emptyCell
              ),
            });
          }}
        >
          +
        </button>
      </Html>

      <Html
        position={[0, 0, grid.data.height + 1]}
        rotation-x={-Math.PI / 2}
        rotation-z={-Math.PI / 2}
        transform
        occlude
        style={{ position: "absolute", right: 0 }}
      >
        <button
          onClick={(e) => {
            setMap({
              name,
              grid: grid.resize(
                [grid.data.width, grid.data.height + 1],
                emptyCell
              ),
            });
          }}
        >
          +
        </button>
      </Html>

      <group>
        <Html
          position={[0, 0, -1]}
          rotation-x={-Math.PI / 2}
          rotation-z={Math.PI / 2}
          transform
          occlude
          style={{ position: "absolute", left: 0 }}
        >
          <button
            onClick={(e) => {
              navigator.clipboard.writeText(JSON.stringify(grid.data));
            }}
          >
            Copy to clipboard
          </button>
          <button
            onClick={(e) => {
              setMap({ name, grid: start(new Grid(maps[name])) });
            }}
          >
            WFC
          </button>
          <select
            value={name}
            onChange={(e) => {
              const name = e.target.value;
              setMap({
                name,
                grid: new Grid(maps[name]),
              });
            }}
          >
            {Object.entries(maps).map(([name, mapData]) => (
              <option key={name} value={name}>
                {name}
              </option>
            ))}
          </select>
        </Html>
      </group>
    </>
  );
}
