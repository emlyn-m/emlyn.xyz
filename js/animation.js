'use strict';

// maths
class Matrix {
    constructor(v) {
        this.height = v.length
        this.width = v[0].length
        this.values = v
    }
    mul(other) {
        if (typeof(other) == typeof(2)) {
            let out = Array(this.height);
            for (let i=0; i < this.height; i++) {
                out[i] = Array(this.width);
                for (let j=0; j < this.width; j++) {
                    out[i][j] = this.values[i][j] * other;
                }
            }
            return new Matrix(out);
        } else if (typeof(other) == typeof(this)) {
            console.assert(this.width == other.height, "Matrix mul dim viol");
            let out = Array(this.height);
            for (let i=0; i < this.height; i++) {
                out[i] = Array(other.width);
                for (let j=0; j < other.width; j++) {
                    let s = 0
                    for (let k=0; k < other.height; k++) {
                        s += this.values[i][k] * other.values[k][j];
                    }
                    out[i][j] = s;
                }
            }
            return new Matrix(out);

        } else {
            console.error("Invalid multiplication operation between Matrix and ", other);
        }
    }

    
}
function abs(x) {
    if (x < 0) { return -x; }
    return x;
}

const FRAMERATE = 60;

function getRotationSpeed() {
    let MIN_ROTATIONS_PER_SECOND = 0.75; 
    let MAX_ROTATIONS_PER_SECOND = 1.5; // increasig this slows
    let root = (Math.random() + MIN_ROTATIONS_PER_SECOND) * MAX_ROTATIONS_PER_SECOND; // Limit to MAX_ROTATIONS_PER_SECOND
    let sgn = Math.random();
    if (sgn > 0.5) { root *= -1; } 
    return root;
}

const PI = 3.1415926535;
let ProjMatrix = new Matrix([[1,0,0],[0,1,0],[0,0,0]]);




// drawing
function draw_px(buf, x, y, tw) {
    buf[tw*Math.round(y)+Math.round(x)] = '+';
}
function draw_line_low(buf, x0, y0, x1, y1, tw) {
    let dx = x1 - x0;
    let dy = y1 - y0;
    let yi = 1;
    if (dy < 0) {
        yi = -1;
        dy = -dy;
    }
    
    let D = (2*dy) - dx;
    let y = y0;
    for (let x=x0; x <= x1; x++) {
        draw_px(buf, x, y, tw);
        if (D > 0) {
            y += yi;
            D += 2*(dy - dx);
        } else {
            D += 2*dy;
        }
    }
}
function draw_line_high(buf, x0, y0, x1, y1, tw) {
    let dx = x1 - x0;
    let dy = y1 - y0;
    let xi = 1;
    if (dx < 0) {
        xi = -1;
        dx = -dx;
    }
    
    let D = (2*dx) - dy;
    let x = x0;
    for (let y=y0; y <= y1; y++) {
        draw_px(buf, x, y, tw);
        if (D > 0) {
            x += xi;
            D += 2*(dx - dy);
        } else {
            D += 2*dx;
        }
    }

}
function draw_line(buf, x0, y0, x1, y1, tw) {
    if (abs(y1 - y0) < abs(x1 - x0)) {
        if (x0 > x1) {
            draw_line_low(buf, x1, y1, x0, y0, tw);
        } else {
            draw_line_low(buf, x0, y0, x1, y1, tw);
        }
    } else {
        if (y0 > y1) {
            draw_line_high(buf, x1, y1, x0, y0, tw);
        } else {
            draw_line_high(buf, x0, y0, x1, y1, tw);
        }
    }
}

// rendering
function render_buf(target, buf, target_w, target_h) {
    let true_buf = '';

    for (let i=0; i < target_h; i++) {
        for (let j=0; j < target_w; j++) {
            true_buf += buf[(i*target_w) + j];
        }
        true_buf += '\n';
    }  

    target.innerHTML = true_buf;
}

function vh(percent) {
    var h = Math.max(document.documentElement.clientHeight, window.innerHeight || 0);
    return (percent * h) / 100;
}

function vw(percent) {
    var w = Math.max(document.documentElement.clientWidth, window.innerWidth || 0);
    return (percent * w) / 100;
}

function vmin(percent) {
    return Math.min(vh(percent), vw(percent));
}

// main
function init() {
    teapot();
    cube();
    tetra();

}


function rotate(vt, const_rot_matrix, hww, hwh) {
    let ss_verts = [];

    for (let i=0; i < vt.length; i++) {
        vt[i] = const_rot_matrix.mul(vt[i]);
        let ssc = ProjMatrix.mul(vt[i]);
        let ssx = ssc.values[0][0] + hww;
        let ssy = ssc.values[1][0] + hwh;
        ss_verts.push([ssx, ssy]);
    }

    return ss_verts;

}

function teapot() {
    let screenWidth = document.getElementById("teapot").clientWidth;
    let screenHeight = document.getElementById("teapot").clientHeight;

    let WINDOW_WIDTH = Math.floor(screenWidth / vmin(0.3)); // chars
    let WINDOW_HEIGHT = Math.floor(screenHeight / vmin(0.3));
    const TL = Math.floor(Math.min(WINDOW_WIDTH, WINDOW_HEIGHT) / 33.000001); // teapot length (chars)
    let teapot_vert_table = [
        new Matrix([[7.0*TL], [-7.0*TL], [0.0*TL]]),new Matrix([[4.97*TL], [-7.0*TL], [-4.97*TL]]),new Matrix([[4.9811*TL], [-7.4922*TL], [-4.9811*TL]]),new Matrix([[7.0156*TL], [-7.4922*TL], [0.0*TL]]),new Matrix([[5.325*TL], [-7.0*TL], [-5.325*TL]]),new Matrix([[7.5*TL], [-7.0*TL], [0.0*TL]]),new Matrix([[0.0*TL], [-7.0*TL], [-7.0*TL]]),new Matrix([[0.0*TL], [-7.4922*TL], [-7.0156*TL]]),new Matrix([[0.0*TL], [-7.0*TL], [-7.5*TL]]),new Matrix([[-5.1387*TL], [-7.0*TL], [-4.97*TL]]),new Matrix([[-5.0022*TL], [-7.4922*TL], [-4.9811*TL]]),new Matrix([[-5.325*TL], [-7.0*TL], [-5.325*TL]]),new Matrix([[-7.0*TL], [-7.0*TL], [0.0*TL]]),new Matrix([[-7.0156*TL], [-7.4922*TL], [0.0*TL]]),new Matrix([[-7.5*TL], [-7.0*TL], [0.0*TL]]),new Matrix([[-4.97*TL], [-7.0*TL], [4.97*TL]]),new Matrix([[-4.9811*TL], [-7.4922*TL], [4.9811*TL]]),new Matrix([[-5.325*TL], [-7.0*TL], [5.325*TL]]),new Matrix([[0.0*TL], [-7.0*TL], [7.0*TL]]),new Matrix([[0.0*TL], [-7.4922*TL], [7.0156*TL]]),new Matrix([[0.0*TL], [-7.0*TL], [7.5*TL]]),new Matrix([[4.97*TL], [-7.0*TL], [4.97*TL]]),new Matrix([[4.9811*TL], [-7.4922*TL], [4.9811*TL]]),new Matrix([[5.325*TL], [-7.0*TL], [5.325*TL]]),new Matrix([[6.5453*TL], [-3.109400000000001*TL], [-6.5453*TL]]),new Matrix([[9.2188*TL], [-3.109400000000001*TL], [0.0*TL]]),new Matrix([[7.1*TL], [0.5*TL], [-7.1*TL]]),new Matrix([[10.0*TL], [0.5*TL], [0.0*TL]]),new Matrix([[0.0*TL], [-3.109400000000001*TL], [-9.2188*TL]]),new Matrix([[0.0*TL], [0.5*TL], [-10.0*TL]]),new Matrix([[-6.5453*TL], [-3.109400000000001*TL], [-6.5453*TL]]),new Matrix([[-7.1*TL], [0.5*TL], [-7.1*TL]]),new Matrix([[-9.2188*TL], [-3.109400000000001*TL], [0.0*TL]]),new Matrix([[-10.0*TL], [0.5*TL], [0.0*TL]]),new Matrix([[-6.5453*TL], [-3.109400000000001*TL], [6.5453*TL]]),new Matrix([[-7.1*TL], [0.5*TL], [7.1*TL]]),new Matrix([[0.0*TL], [-3.109400000000001*TL], [9.2188*TL]]),new Matrix([[0.0*TL], [0.5*TL], [10.0*TL]]),new Matrix([[6.5453*TL], [-3.109400000000001*TL], [6.5453*TL]]),new Matrix([[7.1*TL], [0.5*TL], [7.1*TL]]),new Matrix([[6.2125*TL], [3.0781*TL], [-6.2125*TL]]),new Matrix([[8.75*TL], [3.0781*TL], [0.0*TL]]),new Matrix([[5.325*TL], [4.25*TL], [-5.325*TL]]),new Matrix([[7.5*TL], [4.25*TL], [0.0*TL]]),new Matrix([[0.0*TL], [3.0781*TL], [-8.75*TL]]),new Matrix([[0.0*TL], [4.25*TL], [-7.5*TL]]),new Matrix([[-6.2125*TL], [3.0781*TL], [-6.2125*TL]]),new Matrix([[-5.325*TL], [4.25*TL], [-5.325*TL]]),new Matrix([[-8.75*TL], [3.0781*TL], [0.0*TL]]),new Matrix([[-7.5*TL], [4.25*TL], [0.0*TL]]),new Matrix([[-6.2125*TL], [3.0781*TL], [6.2125*TL]]),new Matrix([[-5.325*TL], [4.25*TL], [5.325*TL]]),new Matrix([[0.0*TL], [3.0781*TL], [8.75*TL]]),new Matrix([[0.0*TL], [4.25*TL], [7.5*TL]]),new Matrix([[6.2125*TL], [3.0781*TL], [6.2125*TL]]),new Matrix([[5.325*TL], [4.25*TL], [5.325*TL]]),new Matrix([[4.5595*TL], [4.7656*TL], [-4.5595*TL]]),new Matrix([[6.4219*TL], [4.7656*TL], [0.0*TL]]),new Matrix([[0.0*TL], [5.0*TL], [0.0*TL]]),new Matrix([[0.0*TL], [4.7656*TL], [-6.4219*TL]]),new Matrix([[-4.5595*TL], [4.7656*TL], [-4.5595*TL]]),new Matrix([[-6.4219*TL], [4.7656*TL], [0.0*TL]]),new Matrix([[-4.5595*TL], [4.7656*TL], [4.5595*TL]]),new Matrix([[0.0*TL], [4.7656*TL], [6.4219*TL]]),new Matrix([[4.5595*TL], [4.7656*TL], [4.5595*TL]]),new Matrix([[-8.0*TL], [-5.125*TL], [0.0*TL]]),new Matrix([[-7.75*TL], [-5.6875*TL], [-1.125*TL]]),new Matrix([[-12.5938*TL], [-5.4765999999999995*TL], [-1.125*TL]]),new Matrix([[-12.0625*TL], [-4.984400000000001*TL], [0.0*TL]]),new Matrix([[-14.25*TL], [-4.0*TL], [-1.125*TL]]),new Matrix([[-13.5*TL], [-4.0*TL], [0.0*TL]]),new Matrix([[-7.5*TL], [-6.25*TL], [0.0*TL]]),new Matrix([[-13.125*TL], [-5.9688*TL], [0.0*TL]]),new Matrix([[-15.0*TL], [-4.0*TL], [0.0*TL]]),new Matrix([[-7.75*TL], [-5.6875*TL], [1.125*TL]]),new Matrix([[-12.5938*TL], [-5.4765999999999995*TL], [1.125*TL]]),new Matrix([[-14.25*TL], [-4.0*TL], [1.125*TL]]),new Matrix([[-13.1719*TL], [-1.2694999999999999*TL], [-1.125*TL]]),new Matrix([[-12.6875*TL], [-1.75*TL], [0.0*TL]]),new Matrix([[-9.75*TL], [1.25*TL], [-1.125*TL]]),new Matrix([[-13.6563*TL], [-0.7891000000000004*TL], [0.0*TL]]),new Matrix([[-9.5*TL], [2.0*TL], [0.0*TL]]),new Matrix([[-13.1719*TL], [-1.2694999999999999*TL], [1.125*TL]]),new Matrix([[-9.75*TL], [1.25*TL], [1.125*TL]]),new Matrix([[8.5*TL], [-2.125*TL], [0.0*TL]]),new Matrix([[8.5*TL], [-0.0625*TL], [-2.475*TL]]),new Matrix([[12.6875*TL], [-3.109400000000001*TL], [-1.7062*TL]]),new Matrix([[11.9375*TL], [-4.0*TL], [0.0*TL]]),new Matrix([[15.0*TL], [-7.0*TL], [-0.9375*TL]]),new Matrix([[13.5*TL], [-7.0*TL], [0.0*TL]]),new Matrix([[8.5*TL], [2.0*TL], [0.0*TL]]),new Matrix([[13.4375*TL], [-2.2187*TL], [0.0*TL]]),new Matrix([[16.5*TL], [-7.0*TL], [0.0*TL]]),new Matrix([[8.5*TL], [-0.0625*TL], [2.475*TL]]),new Matrix([[12.6875*TL], [-3.109400000000001*TL], [1.7062*TL]]),new Matrix([[15.0*TL], [-7.0*TL], [0.9375*TL]]),new Matrix([[15.6328*TL], [-7.334*TL], [-0.75*TL]]),new Matrix([[14.125*TL], [-7.2813*TL], [0.0*TL]]),new Matrix([[15.0*TL], [-7.0*TL], [-0.5625*TL]]),new Matrix([[14.0*TL], [-7.0*TL], [0.0*TL]]),new Matrix([[17.1406*TL], [-7.386699999999999*TL], [0.0*TL]]),new Matrix([[16.0*TL], [-7.0*TL], [0.0*TL]]),new Matrix([[15.6328*TL], [-7.334*TL], [0.75*TL]]),new Matrix([[15.0*TL], [-7.0*TL], [0.5625*TL]]),new Matrix([[1.1552*TL], [-9.9063*TL], [-1.1552*TL]]),new Matrix([[1.625*TL], [-9.9063*TL], [0.0*TL]]),new Matrix([[0.0*TL], [-10.75*TL], [0.0*TL]]),new Matrix([[0.71*TL], [-8.5*TL], [-0.71*TL]]),new Matrix([[1.0*TL], [-8.5*TL], [0.0*TL]]),new Matrix([[0.0*TL], [-9.9063*TL], [-1.625*TL]]),new Matrix([[0.0*TL], [-8.5*TL], [-1.0*TL]]),new Matrix([[-1.1552*TL], [-9.9063*TL], [-1.1552*TL]]),new Matrix([[-0.71*TL], [-8.5*TL], [-0.71*TL]]),new Matrix([[-1.625*TL], [-9.9063*TL], [0.0*TL]]),new Matrix([[-1.0*TL], [-8.5*TL], [0.0*TL]]),new Matrix([[-1.1552*TL], [-9.9063*TL], [1.1552*TL]]),new Matrix([[-0.71*TL], [-8.5*TL], [0.71*TL]]),new Matrix([[0.0*TL], [-9.9063*TL], [1.625*TL]]),new Matrix([[0.0*TL], [-8.5*TL], [1.0*TL]]),new Matrix([[1.1552*TL], [-9.9063*TL], [1.1552*TL]]),new Matrix([[0.71*TL], [-8.5*TL], [0.71*TL]]),new Matrix([[2.9288*TL], [-7.75*TL], [-2.9288*TL]]),new Matrix([[4.125*TL], [-7.75*TL], [0.0*TL]]),new Matrix([[4.615*TL], [-7.0*TL], [-4.615*TL]]),new Matrix([[6.5*TL], [-7.0*TL], [0.0*TL]]),new Matrix([[0.0*TL], [-7.75*TL], [-4.125*TL]]),new Matrix([[0.0*TL], [-7.0*TL], [-6.5*TL]]),new Matrix([[-2.9288*TL], [-7.75*TL], [-2.9288*TL]]),new Matrix([[-4.615*TL], [-7.0*TL], [-4.615*TL]]),new Matrix([[-4.125*TL], [-7.75*TL], [0.0*TL]]),new Matrix([[-6.5*TL], [-7.0*TL], [0.0*TL]]),new Matrix([[-2.9288*TL], [-7.75*TL], [2.9288*TL]]),new Matrix([[-4.615*TL], [-7.0*TL], [4.615*TL]]),new Matrix([[0.0*TL], [-7.75*TL], [4.125*TL]]),new Matrix([[0.0*TL], [-7.0*TL], [6.5*TL]]),new Matrix([[2.9288*TL], [-7.75*TL], [2.9288*TL]]),new Matrix([[4.615*TL], [-7.0*TL], [4.615*TL]]),
    ]
    let teapot_edge_table = [
        [1, 2],[2, 3],[1, 3],[2, 4],[4, 5],[2, 5],[6, 7],[7, 2],[6, 2],[7, 8],[8, 4],[7, 4],[9, 10],[10, 7],[9, 7],[10, 11],[11, 8],[10, 8],[12, 13],[13, 10],[12, 10],[13, 14],[14, 11],[13, 11],[15, 16],[16, 13],[15, 13],[16, 17],[17, 14],[16, 14],[18, 19],[19, 16],[18, 16],[19, 20],[20, 17],[19, 17],[21, 22],[22, 19],[21, 19],[22, 23],[23, 20],[22, 20],[0, 3],[3, 22],[0, 22],[3, 5],[5, 23],[3, 23],[4, 24],[24, 25],[4, 25],[24, 26],[26, 27],[24, 27],[8, 28],[28, 24],[8, 24],[28, 29],[29, 26],[28, 26],[11, 30],[30, 28],[11, 28],[30, 31],[31, 29],[30, 29],[14, 32],[32, 30],[14, 30],[32, 33],[33, 31],[32, 31],[17, 34],[34, 32],[17, 32],[34, 35],[35, 33],[34, 33],[20, 36],[36, 34],[20, 34],[36, 37],[37, 35],[36, 35],[23, 38],[38, 36],[23, 36],[38, 39],[39, 37],[38, 37],[5, 25],[25, 38],[5, 38],[25, 27],[27, 39],[25, 39],[26, 40],[40, 41],[26, 41],[40, 42],[42, 43],[40, 43],[29, 44],[44, 40],[29, 40],[44, 45],[45, 42],[44, 42],[31, 46],[46, 44],[31, 44],[46, 47],[47, 45],[46, 45],[33, 48],[48, 46],[33, 46],[48, 49],[49, 47],[48, 47],[35, 50],[50, 48],[35, 48],[50, 51],[51, 49],[50, 49],[37, 52],[52, 50],[37, 50],[52, 53],[53, 51],[52, 51],[39, 54],[54, 52],[39, 52],[54, 55],[55, 53],[54, 53],[27, 41],[41, 54],[27, 54],[41, 43],[43, 55],[41, 55],[42, 56],[56, 57],[42, 57],[45, 59],[59, 56],[45, 56],[47, 60],[60, 59],[47, 59],[49, 61],[61, 60],[49, 60],[51, 62],[62, 61],[51, 61],[53, 63],[63, 62],[53, 62],[55, 64],[64, 63],[55, 63],[43, 57],[57, 64],[43, 64],[66, 67],[67, 68],[66, 68],[67, 69],[69, 70],[67, 70],[71, 72],[72, 67],[71, 67],[72, 73],[73, 69],[72, 69],[74, 75],[75, 72],[74, 72],[75, 76],[76, 73],[75, 73],[65, 68],[68, 75],[65, 75],[68, 70],[70, 76],[68, 76],[69, 77],[77, 78],[69, 78],[77, 79],[79, 33],[77, 33],[73, 80],[80, 77],[73, 77],[80, 81],[81, 79],[80, 79],[76, 82],[82, 80],[76, 80],[82, 83],[83, 81],[82, 81],[70, 78],[78, 82],[70, 82],[78, 33],[33, 83],[78, 83],[85, 86],[86, 87],[85, 87],[86, 88],[88, 89],[86, 89],[90, 91],[91, 86],[90, 86],[91, 92],[92, 88],[91, 88],[93, 94],[94, 91],[93, 91],[94, 95],[95, 92],[94, 92],[84, 87],[87, 94],[84, 94],[87, 89],[89, 95],[87, 95],[88, 96],[96, 97],[88, 97],[96, 98],[98, 99],[96, 99],[92, 100],[100, 96],[92, 96],[100, 101],[101, 98],[100, 98],[95, 102],[102, 100],[95, 100],[102, 103],[103, 101],[102, 101],[89, 97],[97, 102],[89, 102],[97, 99],[99, 103],[97, 103],[104, 107],[107, 108],[104, 108],[109, 110],[110, 107],[109, 107],[111, 112],[112, 110],[111, 110],[113, 114],[114, 112],[113, 112],[115, 116],[116, 114],[115, 114],[117, 118],[118, 116],[117, 116],[119, 120],[120, 118],[119, 118],[105, 108],[108, 120],[105, 120],[107, 121],[121, 122],[107, 122],[121, 123],[123, 124],[121, 124],[110, 125],[125, 121],[110, 121],[125, 126],[126, 123],[125, 123],[112, 127],[127, 125],[112, 125],[127, 128],[128, 126],[127, 126],[114, 129],[129, 127],[114, 127],[129, 130],[130, 128],[129, 128],[116, 131],[131, 129],[116, 129],[131, 132],[132, 130],[131, 130],[118, 133],[133, 131],[118, 131],[133, 134],[134, 132],[133, 132],[120, 135],[135, 133],[120, 133],[135, 136],[136, 134],[135, 134],[108, 122],[122, 135],[108, 135],[122, 124],[124, 136],[122, 136],[59, 58],[60, 58],[61, 58],[62, 58],[63, 58],[56, 58],[57, 58],[55, 58],
    ]

    let teapot_ROT_SPEED_X = PI / (getRotationSpeed() * FRAMERATE);
    let teapot_ROT_SPEED_Y = PI / (getRotationSpeed() * FRAMERATE);

    let teapot_RotXMatrix = new Matrix([
        [1,0,0],
        [0, Math.cos(teapot_ROT_SPEED_X), -Math.sin(teapot_ROT_SPEED_X)],
        [0, Math.sin(teapot_ROT_SPEED_X), Math.cos(teapot_ROT_SPEED_X)]
    ]);
    let teapot_RotYMatrix = new Matrix([
        [Math.cos(teapot_ROT_SPEED_Y), 0, Math.sin(teapot_ROT_SPEED_Y)],
        [0, 1, 0],
        [-Math.sin(teapot_ROT_SPEED_Y), 0, Math.cos(teapot_ROT_SPEED_Y)]
    ]);

    let teapot_rot_matrix = teapot_RotYMatrix.mul(teapot_RotXMatrix);

    function teapot_loop() {
        // setup output buffer
        let screen_buf = Array(WINDOW_HEIGHT*WINDOW_WIDTH).fill('&nbsp;');
        let ss_verts =  rotate(teapot_vert_table, teapot_rot_matrix, WINDOW_WIDTH/2, WINDOW_HEIGHT/2);

        for (let i=0; i < teapot_edge_table.length; i++) {
            let ss_org = ss_verts[teapot_edge_table[i][0]];
            let ss_dst = ss_verts[teapot_edge_table[i][1]];
            draw_line(screen_buf, ss_org[0], ss_org[1], ss_dst[0], ss_dst[1], WINDOW_WIDTH);
        }
        

        render_buf(document.getElementById("teapot"), screen_buf, WINDOW_WIDTH, WINDOW_HEIGHT);
        setTimeout(teapot_loop, 1000/FRAMERATE);

    }

    teapot_loop();

}
function cube() {
    let screenWidth = document.getElementById("cube").clientWidth;
    let screenHeight = document.getElementById("cube").clientHeight;

    let WINDOW_WIDTH = Math.floor(screenWidth / vmin(0.3)); // chars
    let WINDOW_HEIGHT = Math.floor(screenHeight / vmin(0.3));
    const CL = Math.floor(Math.min(WINDOW_WIDTH, WINDOW_HEIGHT) / 5); // halfcube length (chars)

    let cube_vert_table = [
        new Matrix([[-CL], [-CL], [-CL]]),
        new Matrix([[-CL], [-CL], [CL]]),
        new Matrix([[-CL], [CL], [-CL]]),
        new Matrix([[-CL], [CL], [CL]]),
        new Matrix([[CL], [-CL], [-CL]]),
        new Matrix([[CL], [-CL], [CL]]),
        new Matrix([[CL], [CL], [-CL]]),
        new Matrix([[CL], [CL], [CL]]),
    ];
    let cube_edge_table = [
        [0,1],
        [0,4],
        [0,2],
        [1,3],
        [1,5],
        [2,3],
        [2,6],
        [3,7],
        [4,5],
        [4,6],
        [5,7],
        [6,7],

        [0,2],
        [0,3],
        [0,5],
        [0,6],
        [1,2],
        [1,4],
        [1,6],
        [2,4],
        [2,5],
        [3,4],
        [3,5],
        [3,6],
        [4,7],
        [5,6],



    ];


    let ROT_SPEED_X = PI / (getRotationSpeed() * FRAMERATE);
    let ROT_SPEED_Y = PI / (getRotationSpeed() * FRAMERATE);

    let RotXMatrix = new Matrix([
        [1,0,0],
        [0, Math.cos(ROT_SPEED_X), -Math.sin(ROT_SPEED_X)],
        [0, Math.sin(ROT_SPEED_X), Math.cos(ROT_SPEED_X)]
    ]);
    let RotYMatrix = new Matrix([
        [Math.cos(ROT_SPEED_Y), 0, Math.sin(ROT_SPEED_Y)],
        [0, 1, 0],
        [-Math.sin(ROT_SPEED_Y), 0, Math.cos(ROT_SPEED_Y)]
    ]);
    let cube_rot_matrix = RotYMatrix.mul(RotXMatrix);

    function cube_loop() {
        // setup output buffer
        let screen_buf = Array(WINDOW_HEIGHT*WINDOW_WIDTH).fill('&nbsp;');
        let ss_verts = rotate(cube_vert_table, cube_rot_matrix, WINDOW_WIDTH/2, WINDOW_HEIGHT/2);
        for (let i=0; i < cube_edge_table.length; i++) {
            let ss_org = ss_verts[cube_edge_table[i][0]];
            let ss_dst = ss_verts[cube_edge_table[i][1]];
            draw_line(screen_buf, ss_org[0], ss_org[1], ss_dst[0], ss_dst[1], WINDOW_WIDTH);
        }
        

        render_buf(document.getElementById("cube"), screen_buf, WINDOW_WIDTH, WINDOW_HEIGHT);
        setTimeout(cube_loop, 1000/FRAMERATE);

    }
    cube_loop();

}
function tetra() {
    let screenWidth = document.getElementById("tetra").clientWidth;
    let screenHeight = document.getElementById("tetra").clientHeight;

    let WINDOW_WIDTH = Math.floor(screenWidth / vmin(0.3)); // chars
    let WINDOW_HEIGHT = Math.floor(screenHeight / vmin(0.3));
    const TL = Math.floor(Math.min(WINDOW_WIDTH, WINDOW_HEIGHT) / 3); // halfcube length (chars)

    
    let tetra_vert_table = [
        new Matrix([[0], [0], [0]]),
        new Matrix([[0],[TL],[0]]),
        new Matrix([[0.94280904158*TL], [-TL/3], [0]]),
        new Matrix([[-0.47140452079*TL], [-TL/3], [0.81649658092*TL]]),
        new Matrix([[-0.47140452079*TL], [-TL/3], [-0.81649658092*TL]])

    ]
    let tetra_edge_table = [
        [0,1],
        [0,2],
        [0,3],
        [0,4],
        [1,2],
        [1,3],
        [1,4],
        [2,3],
        [2,4],
        [3,4]
    ]

    let ROT_SPEED_X = PI / (getRotationSpeed() * FRAMERATE);
    let ROT_SPEED_Y = PI / (getRotationSpeed() * FRAMERATE);

    let RotXMatrix = new Matrix([
        [1,0,0],
        [0, Math.cos(ROT_SPEED_X), -Math.sin(ROT_SPEED_X)],
        [0, Math.sin(ROT_SPEED_X), Math.cos(ROT_SPEED_X)]
    ]);
    let RotYMatrix = new Matrix([
        [Math.cos(ROT_SPEED_Y), 0, Math.sin(ROT_SPEED_Y)],
        [0, 1, 0],
        [-Math.sin(ROT_SPEED_Y), 0, Math.cos(ROT_SPEED_Y)]
    ]);
    let tetra_rot_matrix = RotYMatrix.mul(RotXMatrix);

    function terta_loop() {
        // setup output buffer
        let screen_buf = Array(WINDOW_HEIGHT*WINDOW_WIDTH).fill('&nbsp;');
        let ss_verts = rotate(tetra_vert_table, tetra_rot_matrix, WINDOW_WIDTH/2, WINDOW_HEIGHT/2);
        for (let i=0; i < tetra_edge_table.length; i++) {
            let ss_org = ss_verts[tetra_edge_table[i][0]];
            let ss_dst = ss_verts[tetra_edge_table[i][1]];
            draw_line(screen_buf, ss_org[0], ss_org[1], ss_dst[0], ss_dst[1], WINDOW_WIDTH);
        }
        

        render_buf(document.getElementById("tetra"), screen_buf, WINDOW_WIDTH, WINDOW_HEIGHT);
        setTimeout(terta_loop, 1000/FRAMERATE);

    }
    terta_loop();

}


window.addEventListener("load", init);
window.addEventListener("mousemove", mouse_move_listener);