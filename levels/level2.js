const groundSrc2 =
    [
        './assets/img/5_background/layers/3_third_layer/1.png',
        './assets/img/5_background/layers/2_second_layer/1.png',
        './assets/img/5_background/layers/1_first_layer/1.png',
        './assets/img/5_background/layers/3_third_layer/2.png',
        './assets/img/5_background/layers/2_second_layer/2.png',
        './assets/img/5_background/layers/1_first_layer/2.png',
        './assets/img/holz_hintergrund.png'
    ]

const townSrc2 =
    [
        './assets/img/bauernhof1.png',
        './assets/img/bauernhof2.png',
        './assets/img/Hühnerstall 2.png',
        './assets/img/Hühnerstall innen.png'
    ]

const level2 = new Level2(
    [
        new Cloud
    ],
    [
        new Ground(groundSrc2[3], -719),
        new Ground(groundSrc2[4], -719),
        new Ground(groundSrc2[5], -719),
        new Ground(groundSrc2[0], 0),
        new Ground(groundSrc2[1], 0),
        new Ground(groundSrc2[2], 0),
        new Ground(groundSrc2[3], 719),
        new Ground(groundSrc2[4], 719),
        new Ground(groundSrc2[5], 719),
        new Ground(groundSrc2[0], 1438),
        new Ground(groundSrc2[1], 1438),
        new Ground(groundSrc2[2], 1438),
        new Ground(groundSrc2[3], 2157),
        new Ground(groundSrc2[4], 2157),
        new Ground(groundSrc2[5], 2157),
        new Ground(groundSrc2[0], 2876),
        new Ground(groundSrc2[1], 2876),
        new Ground(groundSrc2[2], 2876),
        new Ground(groundSrc2[3], 3595),
        new Ground(groundSrc2[4], 3595),
        new Ground(groundSrc2[5], 3595),
        new Ground(groundSrc2[0], 4314),
        new Ground(groundSrc2[1], 4314),
        new Ground(groundSrc2[2], 4314),
        new Ground(groundSrc2[3], 5033),
        new Ground(groundSrc2[4], 5033),
        new Ground(groundSrc2[5], 5033),
        new Ground(groundSrc2[0], 5752),
        new Ground(groundSrc2[1], 5752),
        new Ground(groundSrc2[2], 5752),
        new Ground(groundSrc2[3], 6471),
        new Ground(groundSrc2[4], 6471),
        new Ground(groundSrc2[5], 6471),
    ],

    [
        new Town(townSrc2[0], 800, -90, 800, 500),
        new Town(townSrc2[1], 1365, 165, 400, 300),
        new Town(townSrc2[2], 1800, -10, 450, 500)
    ],

    [
        new Sky(-719),
        new Sky(0),
        new Sky(719),
        new Sky(1438),
        new Sky(2157),
        new Sky(2876),
        new Sky(3595),
        new Sky(4314),
        new Sky(5033),
        new Sky(5752),
        new Sky(6471)
    ]
);

const scene2 = new Scene(
    [
        // new Ground(groundSrc2[6], -719),
        // new Ground(groundSrc2[6], 0),
        // new Ground(groundSrc2[6], 719),
        new Ground(groundSrc2[3], -719),
        new Ground(groundSrc2[4], -719),
        new Ground(groundSrc2[5], -719),
        new Ground(groundSrc2[0], 0),
        new Ground(groundSrc2[1], 0),
        new Ground(groundSrc2[2], 0),
        new Ground(groundSrc2[3], 719),
        new Ground(groundSrc2[4], 719),
        new Ground(groundSrc2[5], 719),
    ],
    [   
        new Town(townSrc2[3], 0, 20, 720, 480)
    ],
    [
        new Sky(-719),
        new Sky(0),
        new Sky(719)
    ]
);