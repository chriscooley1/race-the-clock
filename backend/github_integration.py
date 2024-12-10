from github import Github
import os
from datetime import datetime
import logging
from pytz import timezone
from PIL import Image
import io
import base64

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

    def compress_image(self, image_path, max_size=(800, 800)):
        try:
            with Image.open(image_path) as img:
                # Convert to RGB if image is in RGBA mode
                if img.mode == "RGBA":
                    img = img.convert("RGB")
                
                # Resize image while maintaining aspect ratio
                img.thumbnail(max_size, Image.Resampling.LANCZOS)
                
                # Save compressed image to bytes buffer
                buffer = io.BytesIO()
                img.save(buffer, format="JPEG", quality=85, optimize=True)
                return buffer.getvalue()
        except Exception as e:
            logger.error(f"Failed to compress image {image_path}: {str(e)}")
            return None

    def create_feedback_issue(self, feedback_data):
        try:
            display_name = feedback_data.get("display_name", "Anonymous User")
            page_url = feedback_data["page_url"]
            route = page_url.split("/")[-1] or "home"
            route = route.replace("-", " ").title()
            
            # Get first 50 characters of message for the title
            message_preview = feedback_data["message"][:50]
            if len(feedback_data["message"]) > 50:
                message_preview += "..."
            
            title = f"{display_name} - {route} - {message_preview}"
            
            # Create the base body text
            body = f"""
## {display_name}

**Page:** {feedback_data['page_url']}
**Time:** {feedback_data['created_at']}

### Message:
{feedback_data['message']}
"""
            # Add images section if there are images
            if feedback_data.get("image_paths"):
                body += "\n### Attached Images:\n"
                for image_path in feedback_data["image_paths"]:
                    try:
                        # Compress the image
                        compressed_image = self.compress_image(image_path)
                        if compressed_image:
                            # Create a temporary file for the compressed image
                            temp_filename = f"temp_{os.path.basename(image_path)}"
                            with open(temp_filename, "wb") as f:
                                f.write(compressed_image)
                            
                            # Upload the image directly to the issue
                            with open(temp_filename, "rb") as f:
                                content = f.read()
                                # Create a blob and get its URL
                                blob = self.repo.create_git_blob(
                                    base64.b64encode(content).decode(),
                                    "base64"
                                )
                                image_url = f"https://raw.githubusercontent.com/{self.repo_name}/main/{temp_filename}"
                                body += f"\n![{os.path.basename(image_path)}]({image_url})\n"
                            
                            # Clean up temporary file
                            os.remove(temp_filename)
                        else:
                            body += f"\n*Failed to process image: {image_path}*\n"
                    except Exception as e:
                        logger.error(f"Failed to process image {image_path}: {str(e)}")
                        body += f"\n*Failed to process image: {image_path}*\n"

            # Create the issue
            issue = self.repo.create_issue(
                title=title,
                body=body,
                labels=["feedback"]
            )
            logger.info(f"Successfully created GitHub issue #{issue.number}")
            return issue.number
        except Exception as e:
            logger.error(f"Failed to create GitHub issue: {str(e)}")
            raise
