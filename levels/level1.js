const groundSrc =
    [
        'assets/img/5_background/layers/3_third_layer/1.png',
        'assets/img/5_background/layers/2_second_layer/1.png',
        'assets/img/5_background/layers/1_first_layer/1.png',
        'assets/img/5_background/layers/3_third_layer/2.png',
        'assets/img/5_background/layers/2_second_layer/2.png',
        'assets/img/5_background/layers/1_first_layer/2.png'
    ]

const townSrc =
    [
        'assets/img/town1.png',
        'assets/img/town2.png'
    ]

const level1 = new Level(
    [
        // new Chicken(),
        // new Chicken(),
        // new Chicken()

    ],
    new Endboss(),
    [
        new Cloud
    ],
    [
        new Ground(groundSrc[3], -719),
        new Ground(groundSrc[4], -719),
        new Ground(groundSrc[5], -719),
        new Ground(groundSrc[0], 0),
        new Ground(groundSrc[1], 0),
        new Ground(groundSrc[2], 0),
        new Ground(groundSrc[3], 719),
        new Ground(groundSrc[4], 719),
        new Ground(groundSrc[5], 719),
        new Ground(groundSrc[0], 1438),
        new Ground(groundSrc[1], 1438),
        new Ground(groundSrc[2], 1438),
        new Ground(groundSrc[3], 2157),
        new Ground(groundSrc[4], 2157),
        new Ground(groundSrc[5], 2157),
        new Ground(groundSrc[0], 2876),
        new Ground(groundSrc[1], 2876),
        new Ground(groundSrc[2], 2876),
        new Ground(groundSrc[3], 3595),
        new Ground(groundSrc[4], 3595),
        new Ground(groundSrc[5], 3595),
        new Ground(groundSrc[0], 4314),
        new Ground(groundSrc[1], 4314),
        new Ground(groundSrc[2], 4314),
        new Ground(groundSrc[3], 5033),
        new Ground(groundSrc[4], 5033),
        new Ground(groundSrc[5], 5033),
        new Ground(groundSrc[0], 5752),
        new Ground(groundSrc[1], 5752),
        new Ground(groundSrc[2], 5752),
        new Ground(groundSrc[3], 6471),
        new Ground(groundSrc[4], 6471),
        new Ground(groundSrc[5], 6471),
    ],

    [
        new Town(townSrc[0], 1438, -125, 800, 650),
        new Town(townSrc[1], 2203, -189, 800, 750)
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