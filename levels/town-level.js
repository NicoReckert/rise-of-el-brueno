const groundSrcTown =
    [
        './assets/img/5_background/layers/3_third_layer/1.png',
        './assets/img/5_background/layers/2_second_layer/1.png',
        './assets/img/5_background/layers/1_first_layer/1.png',
        './assets/img/5_background/layers/3_third_layer/2.png',
        './assets/img/5_background/layers/2_second_layer/2.png',
        './assets/img/5_background/layers/1_first_layer/2.png',
    ]

const townSrcTown =
    [
        './assets/img/town1.png',
        './assets/img/town2.png',
    ]

const townLevel = new Level(
    {
        enemies:
            [
                new Chicken(),
                new Chicken(),
                new Chicken()

            ],
        endboss: new Endboss(),
        clouds:
            [
                new Cloud
            ],
        grounds:
            [
                new Ground(groundSrcTown[3], -719),
                new Ground(groundSrcTown[4], -719),
                new Ground(groundSrcTown[5], -719),
                new Ground(groundSrcTown[0], 0),
                new Ground(groundSrcTown[1], 0),
                new Ground(groundSrcTown[2], 0),
                new Ground(groundSrcTown[3], 719),
                new Ground(groundSrcTown[4], 719),
                new Ground(groundSrcTown[5], 719),
                new Ground(groundSrcTown[0], 1438),
                new Ground(groundSrcTown[1], 1438),
                new Ground(groundSrcTown[2], 1438),
                new Ground(groundSrcTown[3], 2157),
                new Ground(groundSrcTown[4], 2157),
                new Ground(groundSrcTown[5], 2157),
                new Ground(groundSrcTown[0], 2876),
                new Ground(groundSrcTown[1], 2876),
                new Ground(groundSrcTown[2], 2876),
                new Ground(groundSrcTown[3], 3595),
                new Ground(groundSrcTown[4], 3595),
                new Ground(groundSrcTown[5], 3595),
                new Ground(groundSrcTown[0], 4314),
                new Ground(groundSrcTown[1], 4314),
                new Ground(groundSrcTown[2], 4314),
                new Ground(groundSrcTown[3], 5033),
                new Ground(groundSrcTown[4], 5033),
                new Ground(groundSrcTown[5], 5033),
                new Ground(groundSrcTown[0], 5752),
                new Ground(groundSrcTown[1], 5752),
                new Ground(groundSrcTown[2], 5752),
                new Ground(groundSrcTown[3], 6471),
                new Ground(groundSrcTown[4], 6471),
                new Ground(groundSrcTown[5], 6471),
            ],
        towns:
            [
                new Town(townSrcTown[0], 1438, 115, 800, 650),
                new Town(townSrcTown[1], 2203, 51, 800, 750)
            ],
        sky:
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
            ],
        coins:
            [
                new Coin(),
                new Coin(),
                new Coin(),
                new Coin(),
                new Coin(),
                new Coin()
            ],
        bottles:
            [
                new Bottle(),
                new Bottle(),
                new Bottle(),
                new Bottle(),
                new Bottle(),
                new Bottle(),
                new Bottle(),
                new Bottle()
            ]
    }
);