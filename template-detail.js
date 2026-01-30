// Load and display the selected template
document.addEventListener('DOMContentLoaded', () => {
    // Add loading animation to body
    document.body.classList.add('loading');

    setTimeout(() => {
        document.body.classList.remove('loading');
    }, 500);

    const selectedTemplate = JSON.parse(localStorage.getItem('selectedTemplate'));

    if (selectedTemplate) {
        // Generate template content based on category
        let templateContent = '';
        switch(selectedTemplate.category) {
            case 'meeting':
                templateContent = `
                    <p>Dear [Teacher's Name],</p>
                    <p>I hope this email finds you well. I am writing to request a meeting to discuss my child's academic progress and future goals. I believe that regular communication between parents and teachers is essential for student success.</p>
                    <p>I would appreciate the opportunity to meet with you at your earliest convenience to discuss [specific topics or concerns]. Please let me know what times work best for you during the upcoming week.</p>
                    <p>Thank you for your dedication to my child's education. I look forward to hearing from you soon.</p>
                    <p>Best regards,<br>[Your Name]<br>[Your Contact Information]</p>
                `;
                break;
            case 'academic':
                templateContent = `
                    <p>Dear [Teacher's Name],</p>
                    <p>I hope you are doing well. I am writing to discuss some concerns I have regarding my child's academic performance in your class. I want to ensure that [he/she/they] receives the support needed to succeed.</p>
                    <p>Recently, I have noticed [specific academic issues or grades]. I would like to understand what steps we can take to help improve [his/her/their] performance and ensure [he/she/they] stays on track.</p>
                    <p>I am committed to supporting my child's education and would appreciate any guidance you can provide. Please let me know if there are any specific actions I can take at home to help reinforce the classroom learning.</p>
                    <p>Thank you for your attention to this matter. I look forward to your response and working together to support my child's academic growth.</p>
                    <p>Best regards,<br>[Your Name]<br>[Your Contact Information]</p>
                `;
                break;
            case 'feedback':
                templateContent = `
                    <p>Dear [Teacher's Name],</p>
                    <p>I wanted to take a moment to express my sincere appreciation for your dedication and the positive impact you have had on my child's education this year. Your commitment to creating an engaging learning environment has not gone unnoticed.</p>
                    <p>[He/She/They] frequently comes home excited about the lessons and activities in your class. Your ability to make learning both challenging and enjoyable has made a significant difference in [his/her/their] attitude toward school.</p>
                    <p>Thank you for going above and beyond to ensure that every student feels valued and supported. Your passion for teaching is truly inspiring, and I am grateful that my child has you as a teacher.</p>
                    <p>Best regards,<br>[Your Name]<br>[Your Contact Information]</p>
                `;
                break;
            case 'attendance':
                templateContent = `
                    <p>Dear [Teacher's Name],</p>
                    <p>I am writing to inform you that my child, [Child's Name], will be absent from school on [date(s)] due to [brief reason for absence].</p>
                    <p>[He/She/They] will return to school on [return date]. If there are any assignments or important information that needs to be communicated during this time, please let me know how I can best support [his/her/their] continued learning.</p>
                    <p>Thank you for your understanding. I apologize for any inconvenience this may cause and appreciate your continued support of my child's education.</p>
                    <p>Best regards,<br>[Your Name]<br>[Your Contact Information]</p>
                `;
                break;
            case 'activities':
                templateContent = `
                    <p>Dear [Teacher's Name],</p>
                    <p>I hope this email finds you well. I am writing to express my child's interest in participating in [specific extracurricular activity or club]. [He/She/They] has mentioned how much [he/she/they] enjoys [related subject/activity] and believes this would be a great opportunity to further develop [his/her/their] skills.</p>
                    <p>Could you please provide information about the requirements, time commitment, and any necessary forms or applications for joining? I would also appreciate any insights into what students can expect to gain from participating in this activity.</p>
                    <p>Thank you for offering these valuable opportunities for student growth. I look forward to your response and supporting my child's participation.</p>
                    <p>Best regards,<br>[Your Name]<br>[Your Contact Information]</p>
                `;
                break;
            default:
                templateContent = `
                    <p>Dear [Teacher's Name],</p>
                    <p>[Template content would be customized based on the specific communication needs.]</p>
                    <p>Best regards,<br>[Your Name]<br>[Your Contact Information]</p>
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
            },
            template: `
                <div class="template-content">
                    <span class="badge bg-primary mb-3">{{ template.category }}</span>
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