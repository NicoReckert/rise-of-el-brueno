const groundSrcStable =
    [
        './assets/img/holz_hintergrund.webp'
    ]

const townSrcStable =
    [
        './assets/img/Hühnerstall innen2.webp'
    ]

const stableLevel = new Level(
    {
        grounds:
            [
                // new Ground(groundSrcStable[0], -719),
                // new Ground(groundSrcStable[0], 0),
                // new Ground(groundSrcStable[0], 719),
                // new Ground(groundSrcStable[0], -719),
                new Ground(groundSrcStable[0], 0, 0, 720, 1280),
                new Ground(groundSrcStable[0], 1279, 0, 720, 1280),
            ],
        towns:
            [
                new Town(townSrcStable[0], 280, 260, 720, 480)
            ]
    }
);