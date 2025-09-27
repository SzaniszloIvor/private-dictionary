// src/styles/styles.js
export const styles = {
  container: {
    maxWidth: '1400px',
    margin: '20px auto',
    backgroundColor: 'white',
    borderRadius: '15px',
    boxShadow: '0 10px 30px rgba(0,0,0,0.2)',
    overflow: 'hidden'
  },
  header: {
    background: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)',
    color: 'white',
    padding: '30px',
    textAlign: 'center'
  },
  headerTitle: {
    fontSize: '2.5em',
    marginBottom: '10px',
    textShadow: '0 2px 4px rgba(0,0,0,0.3)'
  },
  headerSubtitle: {
    fontSize: '1.2em'
  },
  progressSection: {
    background: '#f8f9fa',
    padding: '20px',
    borderBottom: '2px solid #e9ecef'
  },
  progressStats: {
    display: 'flex',
    justifyContent: 'space-around',
    textAlign: 'center',
    marginBottom: '20px',
    flexWrap: 'wrap',
    gap: '10px'
  },
  statItem: {
    background: 'white',
    padding: '15px',
    borderRadius: '10px',
    boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
    minWidth: '120px'
  },
  statNumber: {
    fontSize: '2em',
    fontWeight: 'bold',
    color: '#4facfe'
  },
  statLabel: {
    color: '#6c757d',
    fontSize: '0.9em'
  },
  progressBar: {
    background: '#e9ecef',
    borderRadius: '10px',
    height: '8px',
    overflow: 'hidden',
    marginBottom: '10px'
  },
  progressFill: {
    background: 'linear-gradient(90deg, #4facfe 0%, #00f2fe 100%)',
    height: '100%',
    transition: 'width 0.3s ease'
  },
  progressInfo: {
    textAlign: 'center',
    marginTop: '10px',
    color: '#6c757d'
  },
  searchControls: {
    padding: '20px',
    background: 'white',
    borderBottom: '1px solid #e9ecef',
    display: 'flex',
    gap: '15px',
    flexWrap: 'wrap',
    alignItems: 'center'
  },
  searchInput: {
    flex: '1',
    minWidth: '200px',
    padding: '12px',
    border: '2px solid #dee2e6',
    borderRadius: '8px',
    fontSize: '16px'
  },
  filterBtn: {
    padding: '10px 20px',
    border: '2px solid #dee2e6',
    background: 'white',
    borderRadius: '8px',
    cursor: 'pointer',
    transition: 'all 0.3s ease'
  },
  filterBtnActive: {
    background: '#4facfe',
    color: 'white',
    borderColor: '#4facfe'
  },
  lessonNavigation: {
    display: 'flex',
    flexWrap: 'wrap',
    gap: '10px',
    padding: '20px',
    background: '#f8f9fa',
    maxHeight: '300px',
    overflowY: 'auto',
    borderBottom: '2px solid #e9ecef'
  },
  lessonNavBtn: {
    padding: '10px 15px',
    border: '2px solid #dee2e6',
    background: 'white',
    borderRadius: '8px',
    cursor: 'pointer',
    transition: 'all 0.3s ease',
    fontSize: '14px',
    fontWeight: '500',
    minWidth: '80px',
    textAlign: 'center'
  },
  lessonNavBtnActive: {
    background: '#4facfe',
    color: 'white',
    borderColor: '#4facfe'
  },
  lessonNavBtnCompleted: {
    background: '#28a745',
    color: 'white',
    borderColor: '#28a745'
  },
  lessonNavBtnEmpty: {
    background: '#f8f9fa',
    color: '#6c757d',
    borderColor: '#dee2e6',
    cursor: 'not-allowed',
    opacity: '0.6'
  },
  lessonContent: {
    padding: '30px',
    minHeight: '400px'
  },
  lessonHeader: {
    textAlign: 'center',
    marginBottom: '30px',
    padding: '20px',
    background: 'linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%)',
    borderRadius: '10px'
  },
  lessonTitle: {
    fontSize: '2em',
    color: '#495057',
    marginBottom: '10px'
  },
  lessonSubtitle: {
    color: '#6c757d',
    fontSize: '1.1em'
  },
  wordCount: {
    display: 'inline-block',
    background: '#4facfe',
    color: 'white',
    padding: '5px 15px',
    borderRadius: '20px',
    fontSize: '0.9em',
    marginTop: '10px'
  },
  dictionaryTable: {
    width: '100%',
    borderCollapse: 'collapse',
    marginTop: '20px',
    boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
    borderRadius: '10px',
    overflow: 'hidden'
  },
  tableHeader: {
    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    color: 'white',
    padding: '15px',
    textAlign: 'left',
    fontSize: '18px',
    fontWeight: 'bold'
  },
  tableRowEven: {
    backgroundColor: '#f8f9fa'
  },
  tableCell: {
    padding: '15px',
    borderBottom: '1px solid #e9ecef',
    verticalAlign: 'middle'
  },
  englishWord: {
    padding: '15px',
    borderBottom: '1px solid #e9ecef',
    fontWeight: 'bold',
    color: '#2c3e50',
    fontSize: '16px'
  },
  phonetic: {
    padding: '15px',
    borderBottom: '1px solid #e9ecef',
    color: '#e74c3c',
    fontStyle: 'italic'
  },
  hungarian: {
    padding: '15px',
    borderBottom: '1px solid #e9ecef',
    color: '#27ae60',
    fontWeight: '500'
  },
  playBtn: {
    background: 'linear-gradient(135deg, #ff6b6b, #ee5a52)',
    color: 'white',
    border: 'none',
    borderRadius: '50%',
    width: '40px',
    height: '40px',
    cursor: 'pointer',
    transition: 'all 0.3s ease',
    fontSize: '16px',
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    boxShadow: '0 2px 8px rgba(255, 107, 107, 0.3)'
  },
  emptyLesson: {
    textAlign: 'center',
    padding: '60px 20px',
    color: '#6c757d'
  },
  emptyLessonIcon: {
    fontSize: '4em',
    marginBottom: '20px'
  },
  noResults: {
    textAlign: 'center',
    padding: '40px',
    color: '#6c757d'
  },
  controls: {
    background: '#f8f9fa',
    padding: '20px',
    textAlign: 'center',
    borderTop: '1px solid #e9ecef'
  },
  addWordsBtn: {
    background: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)',
    color: 'white',
    border: 'none',
    padding: '15px 30px',
    borderRadius: '25px',
    fontSize: '16px',
    cursor: 'pointer',
    transition: 'all 0.3s ease'
  },
  modal: {
    display: 'block',
    position: 'fixed',
    zIndex: 1000,
    left: 0,
    top: 0,
    width: '100%',
    height: '100%',
    backgroundColor: 'rgba(0,0,0,0.5)'
  },
  modalContent: {
    backgroundColor: 'white',
    margin: '5% auto',
    padding: 0,
    borderRadius: '15px',
    width: '90%',
    maxWidth: '600px',
    maxHeight: '90vh',
    overflowY: 'auto',
    boxShadow: '0 10px 30px rgba(0,0,0,0.3)'
  },
  modalHeader: {
    background: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)',
    color: 'white',
    padding: '20px',
    borderRadius: '15px 15px 0 0',
    textAlign: 'center',
    position: 'relative'
  },
  modalBody: {
    padding: '30px'
  },
  closeBtn: {
    color: 'white',
    position: 'absolute',
    right: '20px',
    top: '15px',
    fontSize: '28px',
    fontWeight: 'bold',
    cursor: 'pointer',
    lineHeight: 1
  },
  formGroup: {
    marginBottom: '20px'
  },
  formRow: {
    display: 'flex',
    gap: '15px'
  },
  formInput: {
    width: '100%',
    padding: '12px',
    border: '2px solid #dee2e6',
    borderRadius: '8px',
    fontSize: '16px',
    boxSizing: 'border-box'
  },
  formTextarea: {
    width: '100%',
    padding: '12px',
    border: '2px solid #dee2e6',
    borderRadius: '8px',
    fontSize: '16px',
    boxSizing: 'border-box',
    fontFamily: 'inherit',
    resize: 'vertical'
  },
  lessonSelector: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(120px, 1fr))',
    gap: '10px',
    marginTop: '15px'
  },
  lessonOption: {
    padding: '15px 10px',
    border: '2px solid #dee2e6',
    borderRadius: '8px',
    textAlign: 'center',
    cursor: 'pointer',
    transition: 'all 0.3s ease',
    background: 'white'
  },
  lessonOptionSelected: {
    borderColor: '#4facfe',
    background: '#4facfe',
    color: 'white'
  },
  lessonOptionCompleted: {
    background: '#d4edda',
    borderColor: '#28a745'
  },
  wordPreview: {
    background: '#f8f9fa',
    border: '1px solid #dee2e6',
    borderRadius: '8px',
    padding: '15px',
    marginTop: '15px'
  },
  previewWord: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '8px 0',
    borderBottom: '1px solid #dee2e6'
  },
  removeBtn: {
    background: '#dc3545',
    color: 'white',
    border: 'none',
    borderRadius: '4px',
    padding: '5px 10px',
    cursor: 'pointer'
  },
  modalFooter: {
    textAlign: 'center',
    marginTop: '30px'
  },
  btnSecondary: {
    padding: '12px 25px',
    border: 'none',
    borderRadius: '8px',
    fontSize: '16px',
    cursor: 'pointer',
    transition: 'all 0.3s ease',
    marginRight: '10px',
    background: '#6c757d',
    color: 'white'
  },
  btnSuccess: {
    padding: '12px 25px',
    border: 'none',
    borderRadius: '8px',
    fontSize: '16px',
    cursor: 'pointer',
    transition: 'all 0.3s ease',
    marginRight: '10px',
    background: '#28a745',
    color: 'white'
  }
};
