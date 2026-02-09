// Load and display the selected template
document.addEventListener('DOMContentLoaded', () => {
    // Helper function to get badge class based on category
    function getCategoryBadgeClass(category) {
        const categoryLower = category.toLowerCase();
        return `badge-${categoryLower}`;
    }

    // Add loading animation to body
    document.body.classList.add('loading');

    setTimeout(() => {
        document.body.classList.remove('loading');
    }, 500);

    const selectedTemplate = JSON.parse(localStorage.getItem('selectedTemplate'));

    if (selectedTemplate) {
        // Use subject and body from the JSON template
        let templateContent = '';
        
        if (selectedTemplate.subject && selectedTemplate.body) {
            // Format the email template with subject as header
            templateContent = `
                <p><strong>Subject: ${selectedTemplate.subject}</strong></p>
                <hr>
                ${selectedTemplate.body.split('\n\n').map(para => `<p>${para}</p>`).join('')}
            `;
        } else {
            // Fallback for templates without subject/body (shouldn't happen with new JSON)
            templateContent = `
                <p>Dear [Teacher's Name],</p>
                <p>[Template content]</p>
                <p>Best regards,<br>[Your Name]</p>
            `;
        }

        // Create Vue app for interactive template editing
        const app = Vue.createApp({
            data() {
                return {
                    template: selectedTemplate,
                    content: templateContent,
                    isEditing: false,
                    editMode: false
                }
            },
            computed: {
                displayContent() {
                    return this.content;
                },
                badgeClass() {
                    return getCategoryBadgeClass(this.template.category);
                }
            },
            methods: {
                enableEditMode() {
                    this.editMode = true;
                    this.$nextTick(() => {
                        // Focus on first editable element
                        const firstEditable = this.$el.querySelector('[contenteditable]');
                        if (firstEditable) {
                            firstEditable.focus();
                        }
                    });
                },
                disableEditMode() {
                    this.editMode = false;
                },
                async copyToClipboard() {
                    try {
                        const textToCopy = this.getPlainText();
                        await navigator.clipboard.writeText(textToCopy);

                        // Visual feedback
                        const copyBtn = this.$el.querySelector('#copyButton');
                        const originalHTML = copyBtn.innerHTML;
                        copyBtn.innerHTML = `
                            <svg width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
                                <path d="M10.97 4.97a.75.75 0 0 1 1.07 1.05l-3.99 4.99a.75.75 0 0 1-1.08.02L4.324 8.384a.75.75 0 1 1 1.06-1.06l2.094 2.093 3.473-4.425a.267.267 0 0 1 .02-.022z"/>
                            </svg>
                            Copied!
                        `;
                        copyBtn.classList.remove('btn-outline-primary');
                        copyBtn.classList.add('btn-success');

                        setTimeout(() => {
                            copyBtn.innerHTML = originalHTML;
                            copyBtn.classList.remove('btn-success');
                            copyBtn.classList.add('btn-outline-primary');
                        }, 2000);

                    } catch (err) {
                        console.error('Failed to copy text: ', err);
                        // Fallback
                        const textArea = document.createElement('textarea');
                        textArea.value = this.getPlainText();
                        document.body.appendChild(textArea);
                        textArea.select();
                        document.execCommand('copy');
                        document.body.removeChild(textArea);
                    }
                },
                makeEditable(text) {
                    // Replace [placeholders] with editable spans
                    return text.replace(/\[([^\]]+)\]/g, '<span class="editable-placeholder" contenteditable="true" data-placeholder="$1">[$1]</span>');
                },
                getPlainText() {
                    // Extract text content from the editable template, preserving line breaks
                    const templateTextDiv = this.$el.querySelector('.template-text');
                    if (!templateTextDiv) return '';

                    // Get all text content including edited placeholders
                    const textContent = templateTextDiv.textContent || templateTextDiv.innerText || '';

                    // Clean up extra whitespace and preserve paragraph structure
                    return textContent.replace(/\n\s*\n/g, '\n\n').trim();
                }
            },
            mounted() {
                // Make placeholders editable
                this.content = this.makeEditable(this.content);
                
                // Add focus event listeners to clear placeholder text
                this.$nextTick(() => {
                    const editablePlaceholders = this.$el.querySelectorAll('.editable-placeholder');
                    editablePlaceholders.forEach(span => {
                        span.addEventListener('focus', () => {
                            // If the span still contains placeholder text in brackets, clear it
                            if (span.textContent.match(/^\[.*\]$/)) {
                                span.textContent = '';
                            }
                        });
                    });
                });
            },
            template: `
                <div class="template-content">
                    <span class="badge" :class="badgeClass" style="margin-bottom: 1rem; display: inline-block;">{{ template.category }}</span>
                    <h1 class="display-4 fw-bold mb-4">{{ template.title }}</h1>
                    <p class="lead mb-4">{{ template.description }}</p>
                    <div class="template-body bg-white text-dark p-4 rounded shadow">
                        <div class="d-flex justify-content-between align-items-center mb-3">
                            <h3 class="mb-0">Email Template</h3>
                            <div>
                                <button v-if="!editMode" @click="enableEditMode" class="btn btn-outline-secondary btn-sm me-2">
                                    <svg width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
                                        <path d="M12.146.146a.5.5 0 0 1 .708 0l3 3a.5.5 0 0 1 0 .708l-10 10a.5.5 0 0 1-.168.11l-5 2a.5.5 0 0 1-.65-.65l2-5a.5.5 0 0 1 .11-.168l10-10zM11.207 2.5 13.5 4.793 14.793 3.5 12.5 1.207 11.207 2.5zm1.586 3L10.5 3.207 4 9.707V10h.5a.5.5 0 0 1 .5.5v.5h.5a.5.5 0 0 1 .5.5v.5h.293l6.5-6.5zm-9.761 5.175-.106.106-1.528 3.821 3.821-1.528.106-.106A.5.5 0 0 1 5 12.5V12h-.5a.5.5 0 0 1-.5-.5V11h-.5a.5.5 0 0 1-.468-.325z"/>
                                    </svg>
                                    Edit
                                </button>
                                <button v-if="editMode" @click="disableEditMode" class="btn btn-outline-success btn-sm me-2">
                                    <svg width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
                                        <path d="M10.97 4.97a.75.75 0 0 1 1.07 1.05l-3.99 4.99a.75.75 0 0 1-1.08.02L4.324 8.384a.75.75 0 1 1 1.06-1.06l2.094 2.093 3.473-4.425a.267.267 0 0 1 .02-.022z"/>
                                    </svg>
                                    Done
                                </button>
                                <button @click="copyToClipboard" id="copyButton" class="btn btn-outline-primary btn-sm">
                                    <svg width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
                                        <path d="M4 1.5H3a2 2 0 0 0-2 2V14a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V3.5a2 2 0 0 0-2-2h-1v1h1a1 1 0 0 1 1 1V14a1 1 0 0 1-1 1H3a1 1 0 0 1-1-1V3.5a1 1 0 0 1 1-1h1v-1z"/>
                                        <path d="M9.5 1a.5.5 0 0 1 .5.5v1a.5.5 0 0 1-.5.5h-3a.5.5 0 0 1-.5-.5v-1a.5.5 0 0 1 .5-.5h3zm-3-1A1.5 1.5 0 0 0 5.5 1.5v1A1.5 1.5 0 0 0 7 4h2a1.5 1.5 0 0 0 1.5-1.5v-1A1.5 1.5 0 0 0 9 0h-3z"/>
                                    </svg>
                                    Copy
                                </button>
                            </div>
                        </div>
                        <div class="template-text" v-html="content"></div>
                        <div v-if="editMode" class="alert alert-info mt-3">
                            <small>💡 Click on the bracketed text to edit placeholders</small>
                        </div>
                    </div>
                </div>
            `
        });

        app.mount('#templateDetail');

    } else {
        document.getElementById('templateDetail').innerHTML = `
            <div class="error-message">
                <h2 class="display-5 fw-bold mb-4">Template Not Found</h2>
                <p class="lead">The requested template could not be loaded.</p>
            </div>
        `;
    }
});