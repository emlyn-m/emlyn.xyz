verts = []
edges = []

# todo: multiply by         [[1,0,0],[0,0,-1],[0,1,0]]
# todo: vertical translation by [0,1.5,0]


# mode = "py"
mode = "js"

with open("utah") as inf:
    l = inf.readline()
    while l != "":
        lS = [x for x in l.strip().split(" ") if x != ""]
        if lS[0] == 'v':
            # vertex
            verts.append([float(lS[1]), 5-float(lS[3]), float(lS[2])])

        if lS[0] == 'f':
            lS = [x.split("/")[0] for x in lS[1:]]
            if len(lS) == 4:
                # tri
                edges.append((lS[1], lS[2]))
                edges.append((lS[2], lS[3]))
                edges.append((lS[1], lS[3]))
            if len(lS) == 5:
                # quad
                edges.append((lS[1], lS[2]))
                edges.append((lS[2], lS[3]))
                edges.append((lS[3], lS[4]))
                edges.append((lS[1], lS[4]))

        l = inf.readline()

# curr_min_y = 0
# lowest_verts = []
# eps = 0.5
# for v in verts:
#     if abs(v[1] - curr_min_y) < eps:
#         lowest_verts.append(v)

#     elif v[1] > curr_min_y:
#         curr_min_y = v[1]
#         lowest_verts = [v]
# print(curr_min_y, lowest_verts)

# using bcv = [0,5,0]: furthest right
# using bcv = [6.4219, 4.7656, 0]: second furthest right, closer to screen

bot_c_vert =  [0.0, 4.7656, -6.4219]
bot_verts = [[-4.5595, 4.7656, -4.5595], [-6.4219, 4.7656, 0.0], [-4.5595, 4.7656, 4.5595], [0.0, 4.7656, 6.4219], [4.5595, 4.7656, 4.5595], [6.4219, 4.7656, 0.0], [0,5,0], [4.5595, 4.7656, -4.5595]]

for bv in bot_verts:
    edges.append((verts.index(bv), verts.index(bot_c_vert)))


with open("verts.log", "wt") as of:
    of.write("vert_table = [\n")
    for vert in verts:
        if mode == "js":
            of.write(f"new Matrix([[{vert[0]}*HCL], [{vert[1]}*HCL], [{vert[2]}*HCL]]),")
        elif mode == "py":
            of.write(f"Matrix([[{vert[0]}], [{vert[1]}], [{vert[2]}]]),")
    of.write("\n]\n")

with open("edges.log", "wt") as of:
    of.write("edge_table = [\n")
    for edge in edges:
        of.write(f"[{int(edge[0])-1}, {int(edge[1])-1}],")
    of.write("\n]\n")