from github import Github
import os
from datetime import datetime
import logging

logger = logging.getLogger(__name__)

class GitHubIssueCreator:
    def __init__(self):
        self.github_token = os.environ.get("GITHUB_ACCESS_TOKEN")
        self.repo_name = os.environ.get("GITHUB_REPO")
        
        if not self.github_token or not self.repo_name:
            logger.error("GitHub configuration is missing")
            raise ValueError("GitHub configuration is missing")
        
        try:
            self.github = Github(self.github_token)
            # Test the connection
            self.repo = self.github.get_repo(self.repo_name)
            logger.info(f"Successfully connected to GitHub repo: {self.repo_name}")
        except Exception as e:
            logger.error(f"Failed to initialize GitHub connection: {str(e)}")
            raise

    def create_feedback_issue(self, feedback_data):
        try:
            display_name = feedback_data.get("display_name", "Anonymous User")
            # Extract the route from the full URL
            page_url = feedback_data["page_url"]
            route = page_url.split("/")[-1] or "home"  # If split results in empty string, use "home"
            route = route.replace("-", " ").title()  # Convert "your-collections" to "Your Collections"
            
            title = f"Feedback from {display_name} - {route} - {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}"
            body = f"""
## Feedback from {display_name}

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
            logger.info(f"Successfully created GitHub issue #{issue.number}")
            return issue.number
        except Exception as e:
            logger.error(f"Failed to create GitHub issue: {str(e)}")
            raise
