const groundSrcFarm =
    [
        './assets/img/5_background/layers/3_third_layer/1.png',
        './assets/img/5_background/layers/2_second_layer/1.png',
        './assets/img/5_background/layers/1_first_layer/1.png',
        './assets/img/5_background/layers/3_third_layer/2.png',
        './assets/img/5_background/layers/2_second_layer/2.png',
        './assets/img/5_background/layers/1_first_layer/2.png',
        './assets/img/grass3.png'
    ]

const townSrcFarm =
    [
        './assets/img/bauernhof1.png',
        './assets/img/bauernhof2.png',
        './assets/img/Hühnerstall 2.png',
        './assets/img/stable.png',
        './assets/img/stable2.png'
    ]

const farmLevel = new Level(
    {
        clouds: [
            new Cloud
        ],
        grounds: [
            new Ground(groundSrcFarm[3], -719),
            new Ground(groundSrcFarm[4], -719),
            new Ground(groundSrcFarm[5], -719),
            new Ground(groundSrcFarm[0], 0),
            new Ground(groundSrcFarm[1], 0),
            new Ground(groundSrcFarm[2], 0),
            new Ground(groundSrcFarm[3], 719),
            new Ground(groundSrcFarm[4], 719),
            new Ground(groundSrcFarm[5], 719),
            new Ground(groundSrcFarm[0], 1438),
            new Ground(groundSrcFarm[1], 1438),
            new Ground(groundSrcFarm[2], 1438),
            new Ground(groundSrcFarm[3], 2157),
            new Ground(groundSrcFarm[4], 2157),
            new Ground(groundSrcFarm[5], 2157),
            new Ground(groundSrcFarm[0], 2876),
            new Ground(groundSrcFarm[1], 2876),
            new Ground(groundSrcFarm[2], 2876),
            new Ground(groundSrcFarm[3], 3595),
            new Ground(groundSrcFarm[4], 3595),
            new Ground(groundSrcFarm[5], 3595),
            new Ground(groundSrcFarm[0], 4314),
            new Ground(groundSrcFarm[1], 4314),
            new Ground(groundSrcFarm[2], 4314),
            new Ground(groundSrcFarm[3], 5033),
            new Ground(groundSrcFarm[4], 5033),
            new Ground(groundSrcFarm[5], 5033),
            new Ground(groundSrcFarm[6], 5033, 935, 100), //115 , 400    // 335, 100 //190, 300
            new Ground(groundSrcFarm[0], 5752),
            new Ground(groundSrcFarm[1], 5752),
            new Ground(groundSrcFarm[2], 5752),
            new Ground(groundSrcFarm[3], 6471),
            new Ground(groundSrcFarm[4], 6471),
            new Ground(groundSrcFarm[5], 6471),
        ],
        towns: [
            new Town(townSrcFarm[0], 800, 320, 900, 900), // 800, -42, 600, 450
            new Town(townSrcFarm[1], 1290, 684, 300, 400),
            // new Town(townSrcFarm[2], 1600, 70, 400, 400),
            new Town(townSrcFarm[3], 1550, 530, 600, 600)

        ],
        sky: [
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
        ],
    });