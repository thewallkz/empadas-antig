from crewai import Crew, Process
import sys
import os
from agents import get_code_reviewer, get_qa_specialist
from tasks import create_review_task, create_qa_task

def run_qa_on_file(file_path: str):
    if not os.path.exists(file_path):
        print(f"Error: File '{file_path}' not found.")
        sys.exit(1)
        
    with open(file_path, 'r', encoding='utf-8') as f:
        code_snippet = f.read()
        
    print(f"[*] Starting AI Review for: {file_path}")
    print(f"[*] Code size: {len(code_snippet)} characters")
    
    # Instantiate agents
    reviewer = get_code_reviewer()
    qa = get_qa_specialist()
    
    # Create tasks
    review_task = create_review_task(code_snippet)
    qa_task = create_qa_task(code_snippet)
    
    # Form the Crew
    tech_crew = Crew(
        agents=[reviewer, qa],
        tasks=[review_task, qa_task],
        process=Process.sequential,  # Tasks will be executed one after another
        verbose=True
    )
    
    # Execute
    print("[*] Agents are analyzing...")
    result = tech_crew.kickoff()
    
    output_report = f"audit_report_for_{os.path.basename(file_path)}.md"
    
    with open(output_report, 'w', encoding='utf-8') as f:
        f.write("# CrewAI QA & Code Review Report\n\n")
        f.write(f"**Target File:** `{file_path}`\n\n")
        f.write(str(result))
        
    print(f"\n[+] Success! Report saved as: {output_report}")

if __name__ == "__main__":
    if len(sys.argv) < 2:
        print("Usage: python main.py <path_to_file_to_review>")
        sys.exit(1)
        
    target_file = sys.argv[1]
    
    # Ensure API Key is set
    if not os.getenv("GEMINI_API_KEY"):
        print("Error: GEMINI_API_KEY is not set in your environment.")
        print("Please create a .env file locally with GEMINI_API_KEY='your_key'")
        sys.exit(1)
        
    run_qa_on_file(target_file)
