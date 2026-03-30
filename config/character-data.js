export function buildCharacters(audioManager) {
    const audios = audioManager.audios;
    return [
        {
            name: 'Brünö',
            text: 'Ein einfacher Bauer mit großem Herz. Beschützt seine Tiere und ist bereit, alles für sie zu tun.',
            text2: 'Brünö ist ein einfacher mexikanischer Bauer, der sein Leben seinen Tieren widmet. Als seine Freunde von einer mysteriösen Macht entführt werden, wird aus dem stillen Bauern ein Held. Mit Mut und einem reinen Herzen stellt er sich einer gefährlichen Reise.',
            music: audios.soulThemeMusic,
            textSpeechSound: audios.narratorBruenoIntroVoice
        },
        {
            name: 'Juanito',
            text: 'Das schlaue Huhn. Treu, mutig und Brünös ältester tierischer Freund.',
            text2: 'Juanito ist nicht nur ein Huhn. Er ist Brünös engster Freund. Klug und mutig, oft derjenige, der Gefahren zuerst wittert.',
            music: audios.happyTogetherMusic,
            textSpeechSound: audios.narratorJuanitoIntroVoice
        },
        {
            name: 'Pollito',
            text: 'Ein quirliges Küken, das immer für Chaos sorgt und Brünö zum Lachen bringt.',
            text2: 'Das freche Küken Pollito bringt Leben und Energie in Brünös kleine Welt. Trotz seiner Größe beweist er überraschend viel Mut.',
            music: audios.happyTogetherMusic,
            textSpeechSound: audios.narratorPollitoIntroVoice
        },
        {
            name: 'Lola',
            text: 'Die ruhige Kuh. Gibt Brünö Kraft und Ruhe, eine Art „Familienmutter“.',
            text2: 'Die Kuh Lola ist für Brünö wie eine Schwester. Sie hat ein sanftes Herz, sorgt für Ruhe und Ausgeglichenheit.',
            music: audios.happyTogetherMusic,
            textSpeechSound: audios.narratorLolaIntroVoice
        },
        {
            name: 'Sollita',
            text: 'Eine starke Frau aus der Stadt. Kämpft gegen Ungerechtigkeit und hilft Brünö.',
            text2: 'Sollita ist eine mutige Kämpferin in der Stadt, die Brünö auf seinem Weg unterstützt. Sie weiß mehr über die Portale und die Wesen als Brünö zunächst ahnt.',
            music: audios.sollitaThemeMusic,
            textSpeechSound: audios.narratorSollitaIntroVoice
        },
        {
            name: 'Nayeli',
            text: 'Die weise Älteste, die mit den Ahnen verbunden ist und Brünö auf seine Mission schickt.',
            text2: 'Nayeli ist eine weise Frau mit alten Kräften. Sie kennt Brünös Schicksal und gibt ihm das Schwert der Ahnen.',
            music: audios.nayeliThemeMusic,
            textSpeechSound: audios.narratorNayeliIntroVoice
        },
        {
            name: 'Tadeo',
            text: 'Ein mutiger Junge mit großem Herzen. Von Nayeli gesandt, um Brünö auf seiner Reise zu helfen.',
            text2: 'Tadeo ist ein aufgeweckter Junge mit starkem Herz. Er lebt im Einklang mit der Natur und wurde von der weisen Nayeli geschickt, um Brünö zu helfen. Trotz seines jungen Alters zeigt er Mut, Mitgefühl und Entschlossenheit. Für ihn ist es eine Ehre, Teil von Brünös Reise zu sein.',
            music: audios.tadeoThemeMusic,
            textSpeechSound: audios.narratorTadeoIntroVoice
        }
    ];
}