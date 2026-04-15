from app.models.schemas import StyleOption


STYLE_OPTIONS = [
    StyleOption(
        id="spurgeon",
        label="Spurgeon",
        description="Rich in metaphor, gospel-centered, strong pulpit presence",
    ),
    StyleOption(
        id="lloyd-jones",
        label="Lloyd-Jones",
        description="Methodical, logically rigorous, strong spiritual diagnosis",
    ),
    StyleOption(
        id="fulton-sheen",
        label="Fulton Sheen",
        description="Eloquent, dramatic, Catholic apologetics with clarity and wit",
    ),
    StyleOption(
        id="barron",
        label="Bishop Barron",
        description="Intellectually rich, culturally aware, Catholic evangelical voice",
    ),
    StyleOption(
        id="pope-francis",
        label="Pope Francis",
        description="Pastoral, merciful, simple language rooted in compassion",
    ),
    StyleOption(
        id="piper",
        label="John Piper",
        description="God-centered, passionate, scripture-dense",
    ),
    StyleOption(
        id="keller",
        label="Tim Keller",
        description="Culturally engaged, expository, relatable to modern life",
    ),
    StyleOption(
        id="biblical",
        label="Biblical",
        description="Stays close to scriptural language without imitating a specific pastor",
    ),
    StyleOption(
        id="simple",
        label="Simple",
        description="Plain and direct, accessible to a general audience",
    ),
]
