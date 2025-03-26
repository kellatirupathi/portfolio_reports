document.getElementById('jsonUploadForm').addEventListener('submit', function(e) {
    e.preventDefault();
    const fileInput = document.getElementById('jsonFile');
    const file = fileInput.files[0];
    if (file) {
        const reader = new FileReader();
        reader.onload = function(e) {
            try {
                let jsonData = JSON.parse(e.target.result);
                // Convert single object to array if necessary
                if (!Array.isArray(jsonData)) {
                    jsonData = [jsonData];
                }
                // Validate portfolio data
                if (jsonData.length > 0) {
                    // Process each student's portfolio data
                    const portfolios = jsonData.map((data, index) => {
                        const portfolio = generatePortfolioHTML(data, index);
                        return { html: portfolio, data: data };
                    });

                    alert('Portfolios generated successfully!');

                    // Display download link for results
                    const downloadLink = document.createElement('a');
                    downloadLink.href = '#';
                    downloadLink.textContent = 'Download Portfolios';
                    downloadLink.classList.add('btn', 'btn-success', 'mt-3');
                    downloadLink.addEventListener('click', function(e) {
                        e.preventDefault();
                        const zip = new JSZip();

                        // Add each portfolio HTML to the zip using student_id in the filename
                        portfolios.forEach((portfolio) => {
                            const studentId = portfolio.data.student_id; // Use student_id from the JSON
                            const fileName = `portfolio_${studentId}.html`;
                            zip.file(fileName, portfolio.html);
                        });

                        // Generate and download the zip file
                        zip.generateAsync({type: 'blob'})
                            .then(content => {
                                const link = document.createElement('a');
                                link.href = URL.createObjectURL(content);
                                link.download = 'portfolios.zip';
                                link.click();
                            });
                    });
                    document.getElementById('jsonUploadForm').appendChild(downloadLink);

                    // Preview the first portfolio
                    if (portfolios.length > 0) {
                        const previewContainer = document.createElement('div');
                        previewContainer.innerHTML = `
                            <h3 class="mt-4">Preview of First Portfolio</h3>
                            <div class="preview-container border rounded p-3 mt-2">
                                ${portfolios[0].html}
                            </div>
                        `;
                        document.getElementById('jsonUploadForm').appendChild(previewContainer);
                    }
                } else {
                    throw new Error('Invalid JSON structure: Expected an array of student portfolios');
                }
            } catch (error) {
                console.error('Error processing JSON:', error);
                alert('Error processing JSON: ' + error.message);
            }
        };
        reader.readAsText(file);
    } else {
        alert('Please select a JSON file to upload.');
    }
});

function validateUrl(url) {
    if (!url) return '';
    if (!url.startsWith('http://') && !url.startsWith('https://')) {
        return 'https://' + url;
    }
    return url;
}

function generatePortfolioHTML(data, index) {
    const { 
        name, 
        professional_title, 
        Bio, 
        skills, 
        Projects, 
        email,
        linkedin_profile,
        github_profile,
        total_learning_hours,
        total_coding_questions_solved,
        total_websites_built,
        overall_progress
    } = data;

    // Validate social media links
    const validatedLinkedIn = validateUrl(linkedin_profile);
    const validatedGithub = validateUrl(github_profile);
    const skillsHTML = skills ? `
        <div class="card skills-card mb-4">
            <div class="card-body">
                <div class="skills-container">
                    ${skills.map(skill => `<span class="badge bg-primary me-2 mb-2">${skill}</span>`).join('')}
                </div>
            </div>
        </div>` : '';

    const projectsHTML = data.Projects ? `
        <div class="row">
            ${data.Projects.map(project => `
                <div class="col-md-6 mb-4">
                    <div class="card h-100 project-card">
                        <div class="card-body p-4">
                            <div class="d-flex align-items-center mb-3">
                                <div class="project-icon me-3">
                                    <i class="bi bi-folder2-open text-primary fs-3"></i>
                                </div>
                                <h5 class="card-title mb-0">${project.title}</h5>
                            </div>
                            ${project.link ? 
                                `<a href="${validateUrl(project.link)}" class="btn btn-outline-primary" target="_blank">
                                    <i class="bi bi-box-arrow-up-right me-2"></i>View Project
                                </a>` : 
                                ''}
                        </div>
                    </div>
                </div>
            `).join('')}
        </div>` : '';
                        
    const progressMetricsHTML = `
        <div class="row mb-4">
            <div class="col-md-4">
                <div class="card progress-card">
                    <div class="card-body text-center">
                        <i class="bi bi-clock-history text-primary fs-1 mb-3"></i>
                        <h6 class="card-title fs-5">${total_learning_hours}</h6>
                        <p class="text-muted">Hours spent mastering code</p>
                    </div>
                </div>
            </div>
            <div class="col-md-4">
                <div class="card progress-card">
                    <div class="card-body text-center">
                        <i class="bi bi-code-square text-primary fs-1 mb-3"></i>
                        <h6 class="card-title fs-5">${total_coding_questions_solved}</h6>
                        <p class="text-muted">Problems successfully solved</p>
                    </div>
                </div>
            </div>
            <div class="col-md-4">
                <div class="card progress-card">
                    <div class="card-body text-center">
                        <i class="bi bi-window text-primary fs-1 mb-3"></i>
                        <h6 class="card-title fs-5">${total_websites_built}</h6>
                        <p class="text-muted">Webpages successfully built</p>
                    </div>
                </div>
            </div>
        </div>
    `;

    return `
        <!DOCTYPE html>
        <html lang="en">
        <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>${name}'s Portfolio</title>
            <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/css/bootstrap.min.css" rel="stylesheet">
            <link href="https://cdn.jsdelivr.net/npm/bootstrap-icons@1.10.0/font/bootstrap-icons.css" rel="stylesheet">
            <link href="https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;500;600;700&display=swap" rel="stylesheet">
            <style>
                /* Script-specific CSS enhancements for Portfolio Generator */

/* JSON Upload Area Styling */
.json-upload-area {
  border: 2px dashed var(--primary);
  border-radius: var(--radius);
  padding: 2.5rem;
  text-align: center;
  transition: all 0.3s ease;
  background-color: rgba(67, 97, 238, 0.05);
  position: relative;
  cursor: pointer;
  margin-bottom: 1.5rem;
}

.json-upload-area:hover {
  background-color: rgba(67, 97, 238, 0.1);
  transform: translateY(-3px);
}

.json-upload-area input[type="file"] {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  opacity: 0;
  cursor: pointer;
}

.json-upload-icon {
  font-size: 3rem;
  color: var(--primary);
  margin-bottom: 1rem;
  transition: transform 0.3s ease;
}

.json-upload-area:hover .json-upload-icon {
  transform: scale(1.1);
}

.json-upload-text {
  font-weight: 500;
  color: var(--primary);
  margin-bottom: 0.5rem;
}

.json-upload-hint {
  font-size: 0.9rem;
  color: var(--text-muted);
}

/* Processing Animation */
.processing-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.5);
  backdrop-filter: blur(3px);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  opacity: 0;
  visibility: hidden;
  transition: all 0.3s ease;
}

.processing-overlay.active {
  opacity: 1;
  visibility: visible;
}

.processing-spinner {
  width: 100px;
  height: 100px;
  border: 5px solid rgba(255, 255, 255, 0.3);
  border-radius: 50%;
  border-top-color: var(--primary);
  animation: spin 1s infinite linear;
}

.processing-text {
  position: absolute;
  color: white;
  font-weight: 500;
  margin-top: 120px;
  text-align: center;
  text-shadow: 0 2px 4px rgba(0, 0, 0, 0.3);
}

@keyframes spin {
  to { transform: rotate(360deg); }
}

/* Download Button Styling */
.download-btn {
  background: var(--gradient);
  color: white;
  border: none;
  border-radius: var(--radius-sm);
  padding: 0.8rem 1.5rem;
  font-weight: 500;
  transition: all 0.3s ease;
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  margin-top: 1rem;
  position: relative;
  overflow: hidden;
  z-index: 1;
}

.download-btn::before {
  content: '';
  position: absolute;
  top: 0;
  left: -100%;
  width: 100%;
  height: 100%;
  background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.2), transparent);
  transition: left 0.7s ease;
  z-index: -1;
}

.download-btn:hover {
  transform: translateY(-3px);
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.1);
}

.download-btn:hover::before {
  left: 100%;
}

.download-icon {
  font-size: 1.2rem;
}

/* Preview Container Styles */
.preview-container {
  margin-top: 2rem;
  border-radius: var(--radius);
  border: 1px solid var(--border);
  box-shadow: var(--shadow-md);
  background: white;
  overflow: hidden;
  transition: all 0.3s ease;
  position: relative;
}

.preview-container:hover {
  transform: translateY(-5px);
  box-shadow: var(--shadow-lg);
}

.preview-header {
  background: var(--gradient);
  color: white;
  padding: 1rem;
  font-weight: 500;
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.preview-controls {
  display: flex;
  gap: 0.5rem;
}

.preview-control {
  width: 15px;
  height: 15px;
  border-radius: 50%;
  cursor: pointer;
  transition: all 0.3s ease;
}

.preview-close {
  background: #ff5f57;
}

.preview-minimize {
  background: #febc2e;
}

.preview-expand {
  background: #28c840;
}

.preview-content {
  padding: 1rem;
  max-height: 600px;
  overflow-y: auto;
  scrollbar-width: thin;
  scrollbar-color: var(--primary) var(--light);
}

.preview-content::-webkit-scrollbar {
  width: 8px;
}

.preview-content::-webkit-scrollbar-track {
  background: var(--light);
}

.preview-content::-webkit-scrollbar-thumb {
  background-color: var(--primary);
  border-radius: 20px;
}

/* Portfolio Batch Processing Styles */
.batch-info {
  background: rgba(67, 97, 238, 0.1);
  border-left: 4px solid var(--primary);
  padding: 1rem;
  margin: 1.5rem 0;
  border-radius: 0 var(--radius-sm) var(--radius-sm) 0;
  display: flex;
  align-items: center;
  gap: 1rem;
}

.batch-icon {
  font-size: 1.5rem;
  color: var(--primary);
}

.batch-details {
  flex: 1;
}

.batch-title {
  font-weight: 600;
  color: var(--dark);
  margin-bottom: 0.3rem;
}

.batch-description {
  font-size: 0.9rem;
  color: var(--text-secondary);
  margin: 0;
}

.batch-actions {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
  justify-content: flex-end;
}

/* Portfolio Grid for Multiple Preview */
.portfolio-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 1.5rem;
  margin-top: 2rem;
}

.portfolio-card {
  border-radius: var(--radius);
  overflow: hidden;
  box-shadow: var(--shadow-sm);
  border: 1px solid var(--border);
  transition: all 0.3s ease;
  background: white;
  height: 350px;
  display: flex;
  flex-direction: column;
}

.portfolio-card:hover {
  transform: translateY(-5px);
  box-shadow: var(--shadow-lg);
}

.portfolio-header {
  background: var(--gradient);
  color: white;
  padding: 1.5rem;
  text-align: center;
}

.portfolio-title {
  font-size: 1.2rem;
  font-weight: 600;
  margin-bottom: 0.3rem;
}

.portfolio-subtitle {
  font-size: 0.9rem;
  opacity: 0.9;
}

.portfolio-preview {
  flex: 1;
  overflow: hidden;
  position: relative;
}

.portfolio-preview img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.5s ease;
}

.portfolio-card:hover .portfolio-preview img {
  transform: scale(1.05);
}

.portfolio-overlay {
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  background: linear-gradient(transparent, rgba(0, 0, 0, 0.7));
  padding: 1rem;
  transform: translateY(100%);
  transition: transform 0.3s ease;
}

.portfolio-card:hover .portfolio-overlay {
  transform: translateY(0);
}

.portfolio-actions {
  display: flex;
  justify-content: space-around;
}

/* JSON Schema Display */
.json-schema {
  background: #2d3436;
  color: #ffffff;
  padding: 1.5rem;
  border-radius: var(--radius-sm);
  overflow-x: auto;
  font-family: 'Courier New', monospace;
  margin-bottom: 1.5rem;
  box-shadow: var(--shadow-md);
  position: relative;
}

.json-schema-header {
  position: absolute;
  top: 0;
  right: 0;
  background: var(--primary);
  color: white;
  font-size: 0.8rem;
  padding: 0.3rem 0.6rem;
  border-radius: 0 0 0 var(--radius-sm);
}

.keyword {
  color: #ff79c6;
}

.string {
  color: #f1fa8c;
}

.number {
  color: #bd93f9;
}

.boolean {
  color: #50fa7b;
}

.null {
  color: #ff5555;
}

/* Feedback messages for operations */
.message {
  padding: 1rem;
  margin: 1rem 0;
  border-radius: var(--radius-sm);
  animation: fadeInUp 0.5s ease;
  position: relative;
  padding-left: 3rem;
}

.message::before {
  font-family: "bootstrap-icons";
  position: absolute;
  left: 1rem;
  top: 50%;
  transform: translateY(-50%);
  font-size: 1.5rem;
}

.message-success {
  background-color: rgba(46, 204, 113, 0.1);
  border-left: 4px solid var(--success);
  color: var(--success);
}

.message-success::before {
  content: "\F270";
  color: var(--success);
}

.message-error {
  background-color: rgba(231, 76, 60, 0.1);
  border-left: 4px solid var(--danger);
  color: var(--danger);
}

.message-error::before {
  content: "\F623";
  color: var(--danger);
}

.message-info {
  background-color: rgba(72, 149, 239, 0.1);
  border-left: 4px solid var(--secondary);
  color: var(--secondary);
}

.message-info::before {
  content: "\F432";
  color: var(--secondary);
}

/* Form validation styles */
.invalid-feedback {
  display: none;
  color: var(--danger);
  font-size: 0.85rem;
  margin-top: 0.5rem;
  animation: fadeIn 0.3s ease;
}

.was-validated .form-control:invalid ~ .invalid-feedback,
.form-control.is-invalid ~ .invalid-feedback {
  display: block;
}

.was-validated .form-control:invalid,
.form-control.is-invalid {
  border-color: var(--danger);
  background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' fill='%23dc3545' viewBox='0 0 16 16'%3E%3Cpath d='M16 8A8 8 0 1 1 0 8a8 8 0 0 1 16 0zM5.354 4.646a.5.5 0 1 0-.708.708L7.293 8l-2.647 2.646a.5.5 0 0 0 .708.708L8 8.707l2.646 2.647a.5.5 0 0 0 .708-.708L8.707 8l2.647-2.646a.5.5 0 0 0-.708-.708L8 7.293 5.354 4.646z'/%3E%3C/svg%3E");
  background-repeat: no-repeat;
  background-position: right calc(0.375em + 0.1875rem) center;
  background-size: calc(0.75em + 0.375rem) calc(0.75em + 0.375rem);
  padding-right: calc(1.5em + 0.75rem);
}

.was-validated .form-control:valid,
.form-control.is-valid {
  border-color: var(--success);
  background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' fill='%2328a745' viewBox='0 0 16 16'%3E%3Cpath d='M13.854 3.646a.5.5 0 0 1 0 .708l-7 7a.5.5 0 0 1-.708 0l-3.5-3.5a.5.5 0 1 1 .708-.708L6.5 10.293l6.646-6.647a.5.5 0 0 1 .708 0z'/%3E%3C/svg%3E");
  background-repeat: no-repeat;
  background-position: right calc(0.375em + 0.1875rem) center;
  background-size: calc(0.75em + 0.375rem) calc(0.75em + 0.375rem);
  padding-right: calc(1.5em + 0.75rem);
}

/* Loading States */
.btn-loading {
  position: relative;
  color: transparent !important;
  pointer-events: none;
}

.btn-loading::after {
  content: "";
  position: absolute;
  width: 1rem;
  height: 1rem;
  top: calc(50% - 0.5rem);
  left: calc(50% - 0.5rem);
  border: 2px solid rgba(255, 255, 255, 0.3);
  border-radius: 50%;
  border-top-color: white;
  animation: spin 1s infinite linear;
}

/* Progress indicator */
.progress-wrapper {
  margin: 2rem 0;
  background: var(--light);
  border-radius: var(--radius-sm);
  overflow: hidden;
  height: 8px;
}

.progress-bar {
  height: 100%;
  background: var(--gradient);
  width: 0;
  transition: width 0.3s ease;
  position: relative;
  overflow: hidden;
}

.progress-bar::after {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: linear-gradient(90deg, 
    rgba(255,255,255,0) 0%, 
    rgba(255,255,255,0.3) 50%, 
    rgba(255,255,255,0) 100%);
  animation: progressShimmer 1.5s infinite;
}

@keyframes progressShimmer {
  0% { transform: translateX(-100%); }
  100% { transform: translateX(100%); }
}

/* Portfolio template selection styles */
.template-selector {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
  gap: 1.5rem;
  margin: 2rem 0;
}

.template-card {
  border-radius: var(--radius);
  overflow: hidden;
  box-shadow: var(--shadow-sm);
  transition: all 0.3s ease;
  cursor: pointer;
  border: 2px solid transparent;
  background: white;
}

.template-card:hover {
  transform: translateY(-5px);
  box-shadow: var(--shadow-md);
}

.template-card.selected {
  border-color: var(--primary);
  box-shadow: 0 0 0 3px rgba(67, 97, 238, 0.2);
}

.template-preview {
  height: 160px;
  overflow: hidden;
}

.template-preview img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.5s ease;
}

.template-card:hover .template-preview img {
  transform: scale(1.05);
}

.template-info {
  padding: 1rem;
  text-align: center;
}

.template-name {
  font-weight: 600;
  margin-bottom: 0.5rem;
}

.template-tag {
  display: inline-block;
  font-size: 0.7rem;
  background: rgba(67, 97, 238, 0.1);
  color: var(--primary);
  padding: 0.2rem 0.5rem;
  border-radius: 20px;
  margin-top: 0.5rem;
}

/* Color theme selector */
.color-theme-selector {
  display: flex;
  flex-wrap: wrap;
  gap: 1rem;
  margin: 1.5rem 0;
}

.color-option {
  width: 30px;
  height: 30px;
  border-radius: 50%;
  cursor: pointer;
  transition: all 0.3s ease;
  position: relative;
  border: 2px solid var(--border);
}

.color-option:hover {
  transform: scale(1.1);
}

.color-option.selected {
  border-color: var(--dark);
  transform: scale(1.1);
}

.color-option.selected::after {
  content: '\f633';
  font-family: "bootstrap-icons";
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  color: white;
  font-size: 16px;
  text-shadow: 0 0 2px rgba(0,0,0,0.5);
}

/* Export formats selector */
.export-formats {
  display: flex;
  flex-wrap: wrap;
  gap: 1rem;
  margin: 1.5rem 0;
}

.format-option {
  flex: 1;
  min-width: 120px;
  background: white;
  border: 1px solid var(--border);
  border-radius: var(--radius-sm);
  padding: 1rem;
  text-align: center;
  cursor: pointer;
  transition: all 0.3s ease;
  box-shadow: var(--shadow-sm);
}

.format-option:hover {
  transform: translateY(-3px);
  box-shadow: var(--shadow-md);
}

.format-option.selected {
  border-color: var(--primary);
  background: rgba(67, 97, 238, 0.05);
  box-shadow: 0 0 0 3px rgba(67, 97, 238, 0.2);
}

.format-icon {
  font-size: 2rem;
  color: var(--primary);
  margin-bottom: 0.5rem;
}

.format-label {
  font-weight: 500;
  font-size: 0.9rem;
}

/* File data visualization */
.file-info {
  display: flex;
  align-items: center;
  gap: 1rem;
  background: var(--light);
  border-radius: var(--radius-sm);
  padding: 1rem;
  margin: 1.5rem 0;
}

.file-icon {
  font-size: 2rem;
  color: var(--primary);
}

.file-details {
  flex: 1;
}

.file-name {
  font-weight: 600;
  margin-bottom: 0.3rem;
}

.file-meta {
  display: flex;
  gap: 1rem;
  font-size: 0.8rem;
  color: var(--text-secondary);
}

.file-size, .file-type, .file-date {
  display: flex;
  align-items: center;
  gap: 0.3rem;
}

.file-actions {
  display: flex;
  gap: 0.5rem;
}

/* JSON schema generator styles */
.json-generator {
  background: var(--light);
  border-radius: var(--radius);
  padding: 1.5rem;
  margin: 2rem 0;
}

.json-field {
  margin-bottom: 1.2rem;
  position: relative;
  padding-left: 1.5rem;
}

.json-field::before {
  content: '';
  position: absolute;
  left: 0;
  top: 0;
  bottom: 0;
  width: 2px;
  background: var(--border);
}

.json-field:last-child::before {
  height: 1.2rem;
}

.json-field-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 0.5rem;
}

.json-field-name {
  font-weight: 600;
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.json-field-type {
  font-size: 0.8rem;
  color: var(--text-secondary);
  background: rgba(67, 97, 238, 0.1);
  padding: 0.2rem 0.5rem;
  border-radius: 20px;
}

.json-field-controls {
  display: flex;
  gap: 0.5rem;
}

.json-control {
  cursor: pointer;
  transition: all 0.3s ease;
  color: var(--text-secondary);
}

.json-control:hover {
  color: var(--primary);
}

/* Toast notifications */
.toast-container {
  position: fixed;
  bottom: 20px;
  right: 20px;
  z-index: 1000;
}

.toast {
  background: white;
  border-radius: var(--radius-sm);
  box-shadow: var(--shadow-lg);
  padding: 1rem;
  margin-bottom: 0.5rem;
  min-width: 300px;
  max-width: 400px;
  animation: toastIn 0.3s ease;
  border-left: 4px solid var(--primary);
  position: relative;
  overflow: hidden;
}

.toast.success {
  border-left-color: var(--success);
}

.toast.error {
  border-left-color: var(--danger);
}

.toast.warning {
  border-left-color: var(--warning);
}

.toast-progress {
  position: absolute;
  bottom: 0;
  left: 0;
  height: 3px;
  background: var(--primary);
  width: 100%;
  animation: toastProgress 5s linear forwards;
}

.toast.success .toast-progress {
  background: var(--success);
}

.toast.error .toast-progress {
  background: var(--danger);
}

.toast.warning .toast-progress {
  background: var(--warning);
}

.toast-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 0.5rem;
}

.toast-title {
  font-weight: 600;
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.toast-icon.success {
  color: var(--success);
}

.toast-icon.error {
  color: var(--danger);
}

.toast-icon.warning {
  color: var(--warning);
}

.toast-close {
  cursor: pointer;
  color: var(--text-secondary);
  transition: color 0.3s ease;
}

.toast-close:hover {
  color: var(--dark);
}

.toast-body {
  font-size: 0.9rem;
  color: var(--text-secondary);
}

@keyframes toastIn {
  from { transform: translateX(100%); opacity: 0; }
  to { transform: translateX(0); opacity: 1; }
}

@keyframes toastProgress {
  from { width: 100%; }
  to { width: 0%; }
}

/* Responsive adjustments */
@media (max-width: 768px) {
  .json-upload-area {
    padding: 1.5rem;
  }
  
  .json-upload-icon {
    font-size: 2rem;
  }
  
  .portfolio-grid {
    grid-template-columns: 1fr;
  }
  
  .template-selector {
    grid-template-columns: repeat(auto-fit, minmax(160px, 1fr));
  }
  
  .export-formats {
    flex-direction: column;
  }
  
  .color-theme-selector {
    justify-content: center;
  }
  
  .file-info {
    flex-direction: column;
    align-items: flex-start;
  }
  
  .file-meta {
    flex-direction: column;
    gap: 0.5rem;
  }
  
  .file-actions {
    width: 100%;
    margin-top: 1rem;
  }
  
  .toast {
    min-width: auto;
    max-width: 90%;
  }
}
            </style>
        </head>
        <body>
            <div class="header">
                <div class="container" style="background: transparent; box-shadow: none;">
                    <div class="header-content">
                        <h1 class="header-title">${name}</h1>
                        <p class="header-subtitle">${professional_title || ''}</p>
                    </div>
                </div>
            </div>

            <div class="container py-5">
                ${skills ? `
                <div class="section">
                    <h3 class="section-title">Skills</h3>
                    <div class="skills-container">
                        ${skills.map(skill => `<span class="badge me-2 mb-2">${skill}</span>`).join('')}
                    </div>
                </div>` : ''}

                <div class="section">
                    <h3 class="section-title">Progress Overview</h3>
                    <div class="row">
                        <div class="col-md-4 mb-4">
                            <div class="card progress-card">
                                <div class="card-body text-center p-4">
                                    <div class="progress-icon mb-3">
                                        <i class="bi bi-clock-history fs-1"></i>
                                    </div>
                                    <h5 class="card-title">Time Spent on Coding Platform</h5>
                                    <p class="counter">${total_learning_hours}</p>
                                    <p class="text-muted">Hours spent mastering code</p>
                                </div>
                            </div>
                        </div>
                        <div class="col-md-4 mb-4">
                            <div class="card progress-card">
                                <div class="card-body text-center p-4">
                                    <div class="progress-icon mb-3">
                                        <i class="bi bi-code-square fs-1"></i>
                                    </div>
                                    <h5 class="card-title">Coding Challenges</h5>
                                    <p class="counter">${total_coding_questions_solved}</p>
                                    <p class="text-muted">Problems successfully solved</p>
                                </div>
                            </div>
                        </div>
                        <div class="col-md-4 mb-4">
                            <div class="card progress-card">
                                <div class="card-body text-center p-4">
                                    <div class="progress-icon mb-3">
                                        <i class="bi bi-window fs-1"></i>
                                    </div>
                                    <h5 class="card-title">Projects Completed</h5>
                                    <p class="counter">${total_websites_built}</p>
                                    <p class="text-muted">Webpages successfully built</p>
                                </div>
                            </div>  
                        </div>
                    </div>
                </div>

                ${data.Projects ? `
                <div class="section">
                    <h3 class="section-title">Projects</h3>
                    <div class="row">
                        ${projectsHTML}
                    </div>
                </div>` : ''}

            </div>

            <footer class="footer-contact">
                <div class="container" style="background: transparent; box-shadow: none; margin-bottom: 0; padding: 0.6rem;">
                    <div class="row align-items-center">
                        <div class="col-md-4 text-md-start text-center mb-md-0 mb-2">
                            <div class="small text-white-50">${name} &copy; ${new Date().getFullYear()}</div>
                        </div>
                        <div class="col-md-8">
                            <div class="d-flex justify-content-md-end justify-content-center">
                                <a href="mailto:${email}" class="contact-link d-flex align-items-center justify-content-center me-3">
                                    <div class="contact-icon me-2">
                                        <i class="bi bi-envelope"></i>
                                    </div>
                                    <div class="contact-label">Mail</div>
                                </a>
                                <a href="${linkedin_profile}" target="_blank" class="contact-link d-flex align-items-center me-3">
                                    <div class="contact-icon me-1">
                                        <i class="bi bi-linkedin"></i>
                                    </div>
                                    <span class="contact-value d-none d-sm-inline">LinkedIn</span>
                                </a>
                                <a href="${github_profile}" target="_blank" class="contact-link d-flex align-items-center">
                                    <div class="contact-icon me-1">
                                        <i class="bi bi-github"></i>
                                    </div>
                                    <span class="contact-value d-none d-sm-inline">GitHub</span>
                                </a>
                            </div>
                        </div>
                    </div>
                </div>
            </footer>

            <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/js/bootstrap.bundle.min.js"></script>
        </body>
        </html>
    `;
}

function downloadPortfolio(studentId, portfolioData) {
    const fileName = `${studentId}.html`; // Set the file name using student_id
    const blob = new Blob([portfolioData], { type: 'text/html' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = fileName; // Use the fileName variable
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
}

// Function to handle the download for each student
function handleDownload(student) {
    const studentId = student.student_id;
    const portfolioData = generatePortfolioHTML(student); // Assuming you have a function to generate HTML
    downloadPortfolio(studentId, portfolioData);
}

function updateProgressTracker() {
    const sections = document.querySelectorAll('.form-section');
    
    const progressSteps = document.querySelectorAll('.progress-step');
    
    function isSectionComplete(section) {
        const inputs = section.querySelectorAll('input, textarea');
        return Array.from(inputs).every(input => input.value.trim() !== '');
    }
    
    progressSteps.forEach(step => {
        step.classList.remove('active', 'completed');
    });
    
    let activeIndex = 0;
    for (let i = 0; i < sections.length; i++) {
        if (isSectionComplete(sections[i])) {
            progressSteps[i].classList.add('completed');
            activeIndex = i + 1;
        } else {
            break;
        }
    }
    
    if (activeIndex >= progressSteps.length) {
        activeIndex = progressSteps.length - 1;
    }
    progressSteps[activeIndex].classList.add('active');
}

document.addEventListener('DOMContentLoaded', function() {
    const formInputs = document.querySelectorAll('#portfolioForm input, #portfolioForm textarea');
    
    formInputs.forEach(input => {
        input.addEventListener('blur', updateProgressTracker);
    });
    
    updateProgressTracker();
    
    const progressSteps = document.querySelectorAll('.progress-step');
    progressSteps.forEach((step, index) => {
        step.addEventListener('click', function() {
            const sections = document.querySelectorAll('.form-section');
            if (index < sections.length) {
                sections[index].scrollIntoView({ behavior: 'smooth' });
                
                const firstInput = sections[index].querySelector('input, textarea');
                if (firstInput) {
                    setTimeout(() => firstInput.focus(), 500);
                }
            }
        });
    });
});
document.getElementById('addProject').addEventListener('click', function() {

    setTimeout(updateProgressTracker, 100);
});


function validateUrl(url) {
  if (!url) return '';
  if (!url.startsWith('http://') && !url.startsWith('https://')) {
      return 'https://' + url;
  }
  return url;
}

// Add event listener for form submission
document.getElementById('portfolioForm').addEventListener('submit', function(e) {
  e.preventDefault();
  
  // Get form values
  const name = document.getElementById('name').value;
  const title = document.getElementById('title').value;
  const bio = document.getElementById('bio').value;
  const skillsString = document.getElementById('skills').value;
  const email = document.getElementById('email').value;
  const linkedin = document.getElementById('linkedin').value;
  const github = document.getElementById('github').value;
  
  // Parse skills into array
  const skills = skillsString.split(',').map(skill => skill.trim()).filter(skill => skill);
  
  // Collect projects
  const projectEntries = document.querySelectorAll('.project-entry');
  const projects = Array.from(projectEntries).map(entry => {
      return {
          title: entry.querySelector('.project-name').value,
          tech: entry.querySelector('.project-tech').value
      };
  });
  
  // Create portfolio data object
  const portfolioData = {
      name: name,
      professional_title: title,
      Bio: bio,
      skills: skills,
      Projects: projects,
      email: email,
      linkedin_profile: linkedin,
      github_profile: github,
      total_learning_hours: "120+",
      total_coding_questions_solved: "250+",
      total_websites_built: "15+",
      overall_progress: "75%"
  };
  
  // Generate the HTML
  const portfolioHTML = generatePortfolioHTML(portfolioData);
  
  // Create a download link for the HTML file
  const blob = new Blob([portfolioHTML], { type: 'text/html' });
  const url = URL.createObjectURL(blob);
  
  const downloadLink = document.createElement('a');
  downloadLink.href = url;
  downloadLink.download = `${name.replace(/\s+/g, '_')}_portfolio.html`;
  downloadLink.textContent = 'Download Portfolio';
  downloadLink.classList.add('btn', 'btn-success', 'mt-3', 'ms-2');
  
  // Add download link to the page
  const submitBtn = document.querySelector('button[type="submit"]');
  submitBtn.parentNode.insertBefore(downloadLink, submitBtn.nextSibling);
  
  // Open the portfolio in a new tab
  window.open(url, '_blank');
});

// Add project button event listener
document.getElementById('addProject').addEventListener('click', function() {
  const projectsContainer = document.getElementById('projectsContainer');
  const newProjectEntry = document.createElement('div');
  newProjectEntry.classList.add('project-entry');
  newProjectEntry.innerHTML = `
      <div class="mb-3">
          <label class="form-label">Project Name</label>
          <input type="text" class="form-control project-name" required>
      </div>
      <div class="mb-3">
          <label class="form-label">Technologies Used</label>
          <input type="text" class="form-control project-tech" placeholder="e.g., React, Node.js" required>
      </div>
      <button type="button" class="btn btn-danger btn-sm remove-project">Remove</button>
  `;
  
  projectsContainer.appendChild(newProjectEntry);
  
  // Add event listener to the remove button
  newProjectEntry.querySelector('.remove-project').addEventListener('click', function() {
      projectsContainer.removeChild(newProjectEntry);
  });
});


// Function to handle the download for each student
function downloadPortfolio(studentId, portfolioHTML) {
  const fileName = `portfolio_${studentId}.html`; 
  const blob = new Blob([portfolioHTML], { type: 'text/html' });
  const link = document.createElement('a');
  link.href = URL.createObjectURL(blob);
  link.download = fileName;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}

// Add some enhancements to the main UI
document.addEventListener('DOMContentLoaded', function() {
  // Add animated background to header
  const header = document.querySelector('.header');
  if (header) {
      const particles = document.createElement('div');
      particles.classList.add('particles');
      header.appendChild(particles);
      
      // Create animated particles
      for (let i = 0; i < 20; i++) {
          const particle = document.createElement('div');
          particle.classList.add('particle');
          particle.style.left = `${Math.random() * 100}%`;
          particle.style.top = `${Math.random() * 100}%`;
          particle.style.animationDelay = `${Math.random() * 5}s`;
          particle.style.width = `${Math.random() * 20 + 5}px`;
          particle.style.height = particle.style.width;
          particles.appendChild(particle);
      }
  }
  
  // Add styling for form elements
  const formStyle = document.createElement('style');
  formStyle.textContent = `
      .form-container {
          position: relative;
          z-index: 10;
      }
      
      .form-section h3 {
          font-size: 1.5rem;
          color: var(--primary-color);
          border-left: 4px solid var(--primary-color);
          padding-left: 15px;
          margin-bottom: 1.5rem;
      }
      
      .form-control:focus {
          border-color: var(--primary-color);
          box-shadow: 0 0 0 0.25rem rgba(84, 81, 254, 0.15);
      }
      
      .btn-primary {
          background: var(--gradient-primary);
          border: none;
          padding: 10px 25px;
          border-radius: 30px;
          font-weight: 500;
          transition: all 0.3s ease;
      }
      
      .btn-primary:hover {
          transform: translateY(-3px);
          box-shadow: 0 5px 15px rgba(84, 81, 254, 0.3);
      }
      
      .project-entry {
          background-color: #f8faff;
          border-radius: 12px;
          padding: 20px;
          margin-bottom: 20px;
          border: 1px solid #eaecf5;
          transition: all 0.3s ease;
      }
      
      .project-entry:hover {
          box-shadow: 0 5px 15px rgba(0, 0, 0, 0.05);
          border-color: #d9dfff;
      }
      
      .nav-tabs .nav-link {
          color: var(--text-color);
          border: none;
          border-bottom: 2px solid transparent;
          padding: 10px 20px;
          font-weight: 500;
          transition: all 0.3s ease;
      }
      
      .nav-tabs .nav-link.active {
          color: var(--primary-color);
          background-color: transparent;
          border-bottom: 2px solid var(--primary-color);
      }
      
      .nav-tabs .nav-link:hover:not(.active) {
          border-color: transparent transparent #d9dfff transparent;
      }
      
      .header {
          position: relative;
          overflow: hidden;
      }
      
      .particles {
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          pointer-events: none;
      }
      
      .particle {
          position: absolute;
          background-color: rgba(255, 255, 255, 0.1);
          border-radius: 50%;
          animation: float 15s infinite linear;
      }
      
      @keyframes float {
          0% {
              transform: translateY(0) translateX(0);
              opacity: 0;
          }
          25% {
              opacity: 0.8;
          }
          75% {
              opacity: 0.3;
          }
          100% {
              transform: translateY(-100px) translateX(100px);
              opacity: 0;
          }
      }
      
      .btn-success {
          background: linear-gradient(135deg, #34c759, #28a745);
          border: none;
          padding: 10px 25px;
          border-radius: 30px;
          font-weight: 500;
          transition: all 0.3s ease;
          color: white;
      }
      
      .btn-success:hover {
          transform: translateY(-3px);
          box-shadow: 0 5px 15px rgba(40, 167, 69, 0.3);
      }
      
      .preview-container {
          border-radius: 12px;
          overflow: hidden;
          margin-top: 20px;
          border: 1px solid #eaecf5;
          box-shadow: 0 5px 15px rgba(0, 0, 0, 0.05);
      }
  `;
  document.head.appendChild(formStyle);
});


function downloadPortfolio(studentId, portfolioData) {
  const fileName = `${studentId}.html`; // Set the file name using student_id
  const blob = new Blob([portfolioData], { type: 'text/html' });
  const link = document.createElement('a');
  link.href = URL.createObjectURL(blob);
  link.download = fileName; // Use the fileName variable
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}

// Function to handle the download for each student
function handleDownload(student) {
  const studentId = student.student_id;
  const portfolioData = generatePortfolioHTML(student); // Assuming you have a function to generate HTML
  downloadPortfolio(studentId, portfolioData);
}

function updateProgressTracker() {
  const sections = document.querySelectorAll('.form-section');
  
  const progressSteps = document.querySelectorAll('.progress-step');
  
  function isSectionComplete(section) {
      const inputs = section.querySelectorAll('input, textarea');
      return Array.from(inputs).every(input => input.value.trim() !== '');
  }
  
  progressSteps.forEach(step => {
      step.classList.remove('active', 'completed');
  });
  
  let activeIndex = 0;
  for (let i = 0; i < sections.length; i++) {
      if (isSectionComplete(sections[i])) {
          progressSteps[i].classList.add('completed');
          activeIndex = i + 1;
      } else {
          break;
      }
  }
  
  if (activeIndex >= progressSteps.length) {
      activeIndex = progressSteps.length - 1;
  }
  progressSteps[activeIndex].classList.add('active');
}

document.addEventListener('DOMContentLoaded', function() {
  const formInputs = document.querySelectorAll('#portfolioForm input, #portfolioForm textarea');
  
  formInputs.forEach(input => {
      input.addEventListener('blur', updateProgressTracker);
  });
  
  updateProgressTracker();
  
  const progressSteps = document.querySelectorAll('.progress-step');
  progressSteps.forEach((step, index) => {
      step.addEventListener('click', function() {
          const sections = document.querySelectorAll('.form-section');
          if (index < sections.length) {
              sections[index].scrollIntoView({ behavior: 'smooth' });
              
              const firstInput = sections[index].querySelector('input, textarea');
              if (firstInput) {
                  setTimeout(() => firstInput.focus(), 500);
              }
          }
      });
  });
});
document.getElementById('addProject').addEventListener('click', function() {

  setTimeout(updateProgressTracker, 100);
});
