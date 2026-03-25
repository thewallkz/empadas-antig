from crewai import Task
from agents import get_code_reviewer, get_qa_specialist

# 1. Provide the Code Review Task
def create_review_task(code_snippet: str) -> Task:
    reviewer = get_code_reviewer()
    return Task(
        description=f"Analyze the following code snippet. Look for logic errors, bad patterns, and areas for performance improvement.\n\n```\n{code_snippet}\n```\n",
        expected_output="A list of specific code review comments identifying bugs, bad patterns, and recommendations for improvement.",
        agent=reviewer
    )

# 2. Provide the QA Task
def create_qa_task(code_snippet: str) -> Task:
    qa = get_qa_specialist()
    return Task(
        description=f"Review the original code and the Senior Reviewer's analysis. Create a bullet-point QA audit report. Identify edge cases, write testing scenarios, and flag any unhandled errors.\n\nOriginal Code:\n```\n{code_snippet}\n```",
        expected_output="A complete QA Audit Report in Markdown format detailing edge cases, test scenarios, and systemic bug potentials found in the code.",
        agent=qa,
        # This task will automatically depend on the Review Task since CrewAI executes sequentially by default.
    )
