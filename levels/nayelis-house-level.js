const groundSrcNayelisHouse =
    [
        './assets/img/holz_hintergrund4.png'
    ]

const townSrcNayelisHouse =
    [
        './assets/img/House-Nayeli2.png'
    ]

const nayelisHouseLevel = new Level(
    {
        grounds:
            [
                // new Ground(groundSrcStable[0], -719),
                // new Ground(groundSrcStable[0], 0),
                // new Ground(groundSrcStable[0], 719),
                // new Ground(groundSrcStable[0], -719),
                // new Ground(groundSrcNayelisHouse[0], 0, 0, 720, 1280),
                // new Ground(groundSrcNayelisHouse[0], 1279, 0, 720, 1280),
            ],
        towns:
            [
                new Town(townSrcNayelisHouse[0], 240, 325, 800, 400)
            ]
    }
);