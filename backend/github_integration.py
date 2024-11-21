from github import Github
import os
from datetime import datetime

class GitHubIssueCreator:
    def __init__(self):
        self.github_token = os.environ.get('GITHUB_ACCESS_TOKEN')
        self.repo_name = os.environ.get('GITHUB_REPO')  # format: "username/repo"
        if not self.github_token or not self.repo_name:
            raise ValueError("GitHub configuration is missing")
        
        self.github = Github(self.github_token)
        self.repo = self.github.get_repo(self.repo_name)

    def create_feedback_issue(self, feedback_data):
        title = f"User Feedback - {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}"
        body = f"""
## User Feedback

**Page:** {feedback_data['page_url']}
**Time:** {feedback_data['created_at']}

### Message:
{feedback_data['message']}
"""
        
        # Create the issue
        issue = self.repo.create_issue(
            title=title,
            body=body,
            labels=['feedback']
        )
        
        return issue.number  # Return the issue number 
