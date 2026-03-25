from crewai import Agent
from langchain_google_genai import ChatGoogleGenerativeAI
import os
from dotenv import load_dotenv

load_dotenv()

# Initialize Gemini model (the free tier is very generous, we will use gemini-1.5-flash for speed and context)
llm = ChatGoogleGenerativeAI(
    model="gemini-1.5-flash",
    google_api_key=os.getenv("GEMINI_API_KEY")
)

# Define the Code Review Agent
def get_code_reviewer() -> Agent:
    return Agent(
        role='Senior Next.js Developer & Code Reviewer',
        goal='Analyze the provided code and find logic errors, best practice violations, and bad patterns.',
        backstory=(
            "You are an expert Next.js and React developer with 10 years of experience. "
            "Your eagle eyes spot inefficient code, bugs, and unnecessary complexity immediately. "
            "You love clean, maintainable, and highly performant code."
        ),
        verbose=True,
        allow_delegation=False,
        llm=llm
    )

# Define the QA Specialist Agent
def get_qa_specialist() -> Agent:
    return Agent(
        role='Software Quality Assurance Specialist',
        goal='Ensure the code meets the highest quality standards before shipping. Detail test scenarios and edge cases.',
        backstory=(
            "You are a meticulous QA Engineer. You don't just look for bugs, you look for systemic failures. "
            "You ask 'what if the database fails?', 'what if the user is malicious?'. "
            "Your job is to read the Code Reviewer's analysis, test the assumptions, and produce a final, actionable bug report."
        ),
        verbose=True,
        allow_delegation=False,
        llm=llm
    )
