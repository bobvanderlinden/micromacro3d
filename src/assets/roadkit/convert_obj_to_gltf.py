import glob
import bpy
import os

# Fix Kenney's 3D objects (http://kenney.itch.io/kenney-donation) in Three.js
# Three.js' object loader barfs when object is not made of simple quads.

# This script uses Blender command-line to load each asset, converts to tris,
# then convert to quads (to remove some vertices), and re-saves (overwrites!)

# To run:
# > cd <path to assets>
# > blender -b -P fix_quads.py

for obj_path in glob.glob('*.obj'):
  base_path, extension = os.path.splitext(obj_path)
  gltf_path = base_path + ".gltf"
  bpy.ops.import_scene.obj(filepath=obj_path)
  bpy.ops.export_scene.gltf(filepath=gltf_path, export_format='GLTF_EMBEDDED', export_colors=True)
  bpy.ops.wm.read_factory_settings(use_empty=True)
