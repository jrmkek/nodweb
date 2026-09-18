"""Generates a small architectural massing model (a two-volume modern house)
as a single .glb for the architecture-studio template's 3D viewer — swapping
the generic model-viewer sample astronaut for something that actually reads
as a building. Run once; the output is checked in, not regenerated on build.
"""

import trimesh
import numpy as np

def box(size, translate, rgba):
    b = trimesh.creation.box(extents=size)
    b.apply_translation(translate)
    b.visual = trimesh.visual.ColorVisuals(b, vertex_colors=np.tile(rgba, (len(b.vertices), 1)))
    return b

CONCRETE = [176, 172, 160, 255]   # warm stone/concrete — the ground volume
GLASS = [40, 46, 48, 255]         # dark glazing — the cantilevered volume
ROOF = [58, 55, 48, 255]          # flat roof cap
SITE = [24, 24, 22, 255]          # ground plinth

parts = [
    box([7.6, 4.4, 0.15], [0, 0, -0.08], SITE),            # site plinth
    box([6.4, 3.2, 2.8], [0, 0, 1.4], CONCRETE),           # ground volume
    box([4.2, 2.6, 2.6], [0.6, 1.0, 4.1], GLASS),          # cantilevered upper volume
    box([4.4, 2.8, 0.12], [0.6, 1.0, 5.46], ROOF),         # roof cap on upper volume
    box([6.6, 3.4, 0.12], [0, 0, 2.86], ROOF),             # roof cap on ground volume
]

# normalize footprint to the site plinth so the whole thing sits on one scale
scene = trimesh.Scene(parts)
scene.apply_scale(1 / 6.6)

scene.export("assets/models/atlas-vine-massing.glb")
print("wrote assets/models/atlas-vine-massing.glb")
