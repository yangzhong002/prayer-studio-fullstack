from textwrap import dedent

from app.models.schemas import GenerateRequest


def build_generation_prompt(
    request: GenerateRequest,
    scripture_chunks: list[dict],
) -> str:
    style_line = (
        ", ".join(request.selected_styles) if request.selected_styles else "biblical"
    )

    scripture_block = "\n\n".join(
        f"- {item['metadata'].get('title', 'Untitled')}: {item['text'][:500]}"
        for item in scripture_chunks
    )

    return dedent(
        f"""
        User situation:
        {request.user_input}

        Output language: {request.language}
        Pastor style: {style_line}
        Tone: {request.tone}
        Length: {request.length}

        Tasks:
        1. Based on the provided scripture materials, select the most relevant passages and output a scripture array.
        2. Generate a sermon inspired by the selected pastor style(s). Do not copy any pastor verbatim; capture the spirit and approach of their preaching.
        3. Generate a prayer consistent with the user's situation and the selected style.

        Constraints:
        - Do not fabricate non-existent Bible references.
        - Do not claim "God directly revealed this to you."
        - The sermon should have an opening, scripture exposition, application, and conclusion.
        - The prayer should be God-centered; avoid empty platitudes.
        - Each item in the scripture field must contain reference, text, and relevance_note.

        Available scripture materials:
        {scripture_block or "None"}
        """
    ).strip()
