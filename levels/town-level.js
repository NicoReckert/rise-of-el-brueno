const groundSrcTown =
    [
        './assets/img/5_background/layers/3_third_layer/1.webp',
        './assets/img/5_background/layers/2_second_layer/1.webp',
        './assets/img/5_background/layers/1_first_layer/1.webp',
        './assets/img/5_background/layers/3_third_layer/2.webp',
        './assets/img/5_background/layers/2_second_layer/2.webp',
        './assets/img/5_background/layers/1_first_layer/2.webp',
        './assets/img/5_background/layers/ground-town.webp',
        './assets/img/5_background/layers/ground-town2.webp'
    ]

const townSrcTown =
    [
        './assets/img/town1.webp',
        './assets/img/town2.webp',
        './assets/img/town3.webp',
        './assets/img/town4.webp',
        './assets/img/town5.webp',
        './assets/img/town6.webp'

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
                new Ground(groundSrcTown[5], 6471)
            ],
        towns:
            [
                new Town(townSrcTown[0], 1238, 5, 1000, 800),
                new Town(townSrcTown[1], 2180, -105, 1000, 1000),
                // new Town(townSrcTown[2], 3160, 25, 800, 800),
                new Town(townSrcTown[3], 3085, -35, 800, 800),
                new Town(townSrcTown[4], 3900, -18, 800, 800),
                new Town(townSrcTown[5], 4600, -17, 1000, 800)
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
let calculationX = 1400
for (let index = 0; index < 20; index++) {
    townLevel.grounds.push(new Ground(groundSrcTown[7], `${calculationX}`, 572, 150, 300));
    calculationX = calculationX + 100;
}
