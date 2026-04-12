from app.models.schemas import StyleOption


STYLE_OPTIONS = [
    StyleOption(id="spurgeon", label="Spurgeon", description="Rich in metaphor, gospel-centered, strong pulpit presence"),
    StyleOption(id="lloyd-jones", label="Lloyd-Jones", description="Methodical, logically rigorous, strong spiritual diagnosis"),
    StyleOption(id="tozer", label="Tozer", description="Reverent, introspective, deep spiritual tension"),
    StyleOption(id="piper", label="John Piper", description="God-centered, passionate, scripture-dense"),
    StyleOption(id="keller", label="Tim Keller", description="Culturally engaged, expository, relatable to modern life"),
    StyleOption(id="biblical", label="Biblical", description="Stays close to scriptural language without imitating a specific pastor"),
    StyleOption(id="simple", label="Simple", description="Plain and direct, accessible to a general audience"),
]
