import { ModelGallery } from "../ModelGallery";
import { RoadkitModel } from "../../assets/roadkit";
import * as urls from "../../assets/roadkit/urls";
import { useMemo, useState } from "react";
import { values } from "lodash";
import { Html } from "@react-three/drei";
import { Gallery } from "../Gallery";
import { BoxGeometry } from "three";
import * as maps from "../../assets/maps";

type TileData = {
  url: string;
};

type CellData = {
  tile: TileData;
  rotation: Rotation;
};
type Rotation = 0 | 1 | 2 | 3;

type GridData<TCell = CellData> = {
  width: number;
  height: number;
  cells: (TCell | null)[];
};

function initGridData(
  width: number,
  height: number,
  fillCell: CellData | null
): GridData {
  return {
    width,
    height,
    cells: new Array(width * height).fill(fillCell),
  };
}

type Coords = [number, number];

class Grid<TCell = CellData> {
  constructor(public data: GridData<TCell>) {}

  getCell([x, y]: Coords) {
    return this.data.cells[y * this.data.width + x];
  }

  setCell([x, y]: Coords, cell: TCell) {
    this.data.cells[y * this.data.width + x] = cell;
  }

  resize([width, height]: Coords, emptyCell: TCell): Grid {
    const newGrid = new Grid({
      ...this.data,
      width,
      height,
      cells: new Array(width * height),
    });
    for (let x = 0; x < width; x++) {
      for (let y = 0; y < height; y++) {
        const cell =
          x < this.data.width && y < this.data.height
            ? this.getCell([x, y])
            : emptyCell;
        newGrid.setCell([x, y], cell);
      }
    }
    return newGrid;
  }

  *[Symbol.iterator](): Iterator<{ x: number; y: number; cell: TCell }> {
    for (let y = 0; y < this.data.height; y++) {
      for (let x = 0; x < this.data.width; x++) {
        const cell = this.getCell([x, y]);
        if (cell) {
          yield { x, y, cell: this.getCell([x, y]) };
        }
      }
    }
  }
}

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
      url={data.tile.url}
      rotation={[0, data.rotation * Math.PI * 0.5, 0]}
    />
  );
}

const tiles = Object.fromEntries(
  Object.entries(urls).map(([key, url]) => [key, { url }])
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
      grid: new Grid(gridData),
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
