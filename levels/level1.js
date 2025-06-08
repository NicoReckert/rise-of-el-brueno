const groundSrc =
    [
        'assets/img/5_background/layers/3_third_layer/1.png',
        'assets/img/5_background/layers/2_second_layer/1.png',
        'assets/img/5_background/layers/1_first_layer/1.png',
        'assets/img/5_background/layers/3_third_layer/2.png',
        'assets/img/5_background/layers/2_second_layer/2.png',
        'assets/img/5_background/layers/1_first_layer/2.png'
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
    ],
    [new Sky(-719), new Sky(0), new Sky(719), new Sky(1438)]
);