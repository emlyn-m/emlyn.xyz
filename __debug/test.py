#!/usr/bin/env python3

import math
import time

WINDOW_SIZE = 700
HCL = 10
WINDOW_SCALE = 10

FRAMERATE = 60

import pygame
pygame.init()

class Matrix:

    def __init__(self, v):
        self.height = len(v)
        self.width = len(v[0])
        self.values = v

    def __str__(self):
        strfied = ""
        for i in range(self.height):
            for j in range(self.width):
                strfied += str(self.values[i][j]) + " "
            strfied = strfied[:-1]
            strfied += "\n"
        strfied = strfied[:-1]
        return strfied

    def __add__(self, other):
        assert(other.width == self.width)
        assert(other.height == self.height)

        new_output = [[None for i in range(self.width)] for j in range(self.height)]
        for i in range(self.height):
            for j in range(self.width):
                new_output[i][j] = self.values[i][j] + other.values[i][j]

        return Matrix(new_output)

    def __mul__(self, other):

        if type(other) == type(2):
            output = [[None for i in range(self.width)] for j in range(self.height)]
            for i in range(self.height):
                for j in range(self.width):
                    output[i][j] = other * self.values[i][j]
            return Matrix(output)

        
        assert(self.width == other.height)
        
        output = [[None for i in range(other.width)] for j in range(self.height)]
        for i in range(self.height):
            for j in range(other.width):
                s = 0
                for k in range(other.height):
                    s += self.values[i][k] * other.values[k][j]

                output[i][j] = s

        return Matrix(output)

    def det(self):

        # Hardcoded for 1x1 and 2x2, else use cofactor expansion along the first column
        def minor(iR, jR):

            # Remove ith row, and the jth column
            output = [[None for i in range(self.width - 1)] for j in range(self.width - 1)]
            for i in range(self.height):
                for j in range(self.width):
                    if i == iR or j == jR:
                        continue

                    iO = i if i < iR else i - 1
                    jO = j if j < jR else j - 1
                    output[iO][jO] = self.values[i][j]

            return Matrix(output)

        
        assert(self.width == self.height)
        if self.width == 1:
            return self.values[0][0]

        if self.width == 2:
            return self.values[0][0] * self.values[1][1] - self.values[1][0] * self.values[0][1]

        s = 0
        for i in range(self.height):
            s += self.values[i][0] * (-1)**(i) * minor(i, 0).det()

        return s

    def trans(self):
        new_values = [[None for i in range(self.height)] for j in range(self.width)]
        for i in range(self.width):
            for j in range(self.height):
                new_values[i][j] = self.values[j][i]
        return Matrix(new_values)

def main():
    screen = pygame.display.set_mode((WINDOW_SIZE,WINDOW_SIZE))
    clock = pygame.time.Clock()
    running = True

    # vert_table = [
    #     Matrix([[-teapot_LENGTH,teapot_LENGTH,teapot_LENGTH]]).trans(),
    #     Matrix([[teapot_LENGTH,teapot_LENGTH,teapot_LENGTH]]).trans(),
    #     Matrix([[-teapot_LENGTH,teapot_LENGTH,-teapot_LENGTH]]).trans(),
    #     Matrix([[teapot_LENGTH,teapot_LENGTH,-teapot_LENGTH]]).trans(),
    #     Matrix([[-teapot_LENGTH,-teapot_LENGTH,teapot_LENGTH]]).trans(),
    #     Matrix([[teapot_LENGTH,-teapot_LENGTH,teapot_LENGTH]]).trans(),
    #     Matrix([[-teapot_LENGTH,-teapot_LENGTH,-teapot_LENGTH]]).trans(),
    #     Matrix([[teapot_LENGTH,-teapot_LENGTH,-teapot_LENGTH]]).trans()]
    # edge_table = [
    #     (0,1),
    #     (0,2),
    #     (0,4),
    #     (1,3),
    #     (1,5),
    #     (2,3),
    #     (2,6),
    #     (3,7),
    #     (4,5),
    #     (4,6),
    #     (5,7),
    #     (6,7)]

    
    vert_table = [
        Matrix([[0], [HCL], [0]]),
        Matrix([[0], [-HCL], [HCL]]),
        Matrix([[-HCL/0.414], [-HCL], [-HCL/0.414]]),
        Matrix([[HCL/0.414], [-HCL], [-HCL/0.414]]),
    ]

    edge_table = [
        [0,1],[0,2],[0,3],[1,2],[1,3],[2,3]

    ]


    ProjMatrix = Matrix([
        [1,0,0],
        [0,1,0],
        [0,0,0]
    ])

    rotSpeedX = (2*math.pi)/500
    rotSpeedY = -(2*math.pi)/200

    rotXMat = Matrix([
            [1,0,0],
            [0, math.cos(rotSpeedX), -math.sin(rotSpeedX)],
            [0, math.sin(rotSpeedX), math.cos(rotSpeedX)]
        ])

    rotYMat = Matrix([
        [math.cos(rotSpeedY), 0, math.sin(rotSpeedY)],
        [0, 1, 0],
        [-math.sin(rotSpeedY), 0, math.cos(rotSpeedY)]
    ])

    
    while running:
        for event in pygame.event.get():
            if event.type == pygame.QUIT or event.type == pygame.KEYDOWN:
                running = False
        screen.fill("black")

        # perform rotation
        for i in range(len(vert_table)):
            vert_table[i] = rotYMat * (rotXMat * vert_table[i])

        # compute screenspace vertex coordinates
        ss_verts = []
        for vert in vert_table:
            new_coord = (ProjMatrix * vert)
            ssX = (new_coord.values[0][0] * WINDOW_SCALE) + WINDOW_SIZE/2
            ssY = (new_coord.values[1][0] * WINDOW_SCALE) + WINDOW_SIZE/2
            ss_verts.append((ssX, ssY))
            pygame.draw.circle(screen, 'red', (ssX,ssY), 2)

        # render teapot wireframe
        for edge in edge_table:
            ss_org = ss_verts[edge[0]]
            ss_dst = ss_verts[edge[1]]

            pygame.draw.line(screen, 'red', (int(ss_org[0]), int(ss_org[1])), (int(ss_dst[0]), int(ss_dst[1])))



        pygame.display.flip()
        clock.tick(FRAMERATE)

def draw_line_low(buf, x0, y0, x1,  y1):
    dx = x1 - x0
    dy = y1 - y0
    yi = 1
    if dy < 0:
        yi = -1
        dy = -dy

    D = (2*dy) - dx
    y = y0

    for x in range(x0, x1+1):
        buf[y][x] = '#'
        if D > 0:
            y += yi
            D += 2*(dy - dx)
        else:
            D += 2*dy
def draw_line_high(buf, x0, y0, x1, y1):
    dx = x1 - x0
    dy = y1 - y0
    xi = 1
    if dx < 0:
        xi = -1
        dx = -dx
    D = (2*dx) - dy
    x = x0
    for y in range(y0, y1+1):
        buf[y][x] = '#'
        if D > 0:
            x += xi
            D += 2*(dx - dy)
        else:
            D += 2*dx
def draw_line(buf, x0, y0, x1, y1):
    if abs(y1 - y0) < abs(x1 - x0):
        if x0 > x1:
            draw_line_low(buf, x1, y1, x0, y0)
        else:
            draw_line_low(buf, x0, y0, x1, y1)
    else:
        if y0 > y1:
            draw_line_high(buf, x1, y1, x0, y0)
        else:
            draw_line_high(buf, x0, y0, x1, y1)


def point_sign(p0, p1, p2):
    return (p0[0] - p2[0]) * (p1[1] - p2[1]) - (p1[0] - p2[0]) * (p0[1] - p2[1]);

#half-plane created by the edges 
def point_in_tri(p, verts):
    d1 = point_sign(p, verts[0], verts[1])
    d2 = point_sign(p, verts[1], verts[2])
    d3 = point_sign(p, verts[2], verts[0])

    has_neg = (d1 < 0) or (d2 < 0) or (d3 < 0);
    has_pos = (d1 > 0) or (d2 > 0) or (d3 > 0);

    return not (has_neg and has_pos)

if __name__ == "__main__":
    main()