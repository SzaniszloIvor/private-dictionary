// src/components/ErrorBoundary.jsx
import React from 'react';

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { 
      hasError: false,
      error: null,
      errorInfo: null
    };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    console.error('ErrorBoundary caught an error:', error, errorInfo);
    this.setState({
      error,
      errorInfo
    });
  }

  handleReset = () => {
    this.setState({ 
      hasError: false,
      error: null,
      errorInfo: null
    });
  };

  render() {
    if (this.state.hasError) {
      return (
        <div className="
          min-h-screen flex items-center justify-center
          bg-gradient-to-br from-red-50 to-pink-50
          dark:from-red-900/20 dark:to-pink-900/20
          p-6
        ">
          <div className="
            max-w-2xl w-full
            bg-white dark:bg-gray-800
            rounded-2xl shadow-2xl
            p-8
            text-center
          ">
            {/* Error Icon */}
            <div className="text-8xl mb-6">
              🚨
            </div>

            {/* Title */}
            <h1 className="
              text-3xl font-bold mb-4
              text-gray-800 dark:text-gray-100
            ">
              Hoppá! Valami hiba történt
            </h1>

            {/* Description */}
            <p className="
              text-lg text-gray-600 dark:text-gray-400 mb-6
            ">
              A gyakorlási mód váratlan hibát észlelt. Ne aggódj, az adataid biztonságban vannak!
            </p>

            {/* Error Details (Development only) */}
            {process.env.NODE_ENV === 'development' && this.state.error && (
              <details className="
                mb-6 p-4 rounded-lg
                bg-gray-100 dark:bg-gray-900
                text-left
                border border-gray-300 dark:border-gray-700
              ">
                <summary className="
                  font-bold text-gray-700 dark:text-gray-300
                  cursor-pointer
                ">
                  🐛 Fejlesztői információk
                </summary>
                <pre className="
                  mt-4 text-xs overflow-auto
                  text-red-600 dark:text-red-400
                ">
                  {this.state.error.toString()}
                  {'\n\n'}
                  {this.state.errorInfo?.componentStack}
                </pre>
              </details>
            )}

            {/* Action Buttons */}
            <div className="flex gap-4 justify-center">
              <button
                onClick={this.handleReset}
                className="
                  px-6 py-3 rounded-lg
                  bg-blue-500 hover:bg-blue-600
                  dark:bg-blue-600 dark:hover:bg-blue-700
                  text-white font-medium
                  transition-all duration-200
                  hover:scale-105
                "
              >
                🔄 Újrapróbálom
              </button>

              <button
                onClick={() => window.location.href = '/'}
                className="
                  px-6 py-3 rounded-lg
                  bg-gray-500 hover:bg-gray-600
                  dark:bg-gray-600 dark:hover:bg-gray-700
                  text-white font-medium
                  transition-all duration-200
                  hover:scale-105
                "
              >
                🏠 Vissza a főoldalra
              </button>
            </div>

            {/* Help Text */}
            <div className="
              mt-6 p-4 rounded-lg
              bg-blue-50 dark:bg-blue-900/20
              border border-blue-200 dark:border-blue-700
            ">
              <p className="text-sm text-blue-800 dark:text-blue-300">
                💡 <strong>Segítség:</strong> Ha a probléma továbbra is fennáll:
              </p>
              <ul className="text-sm text-blue-700 dark:text-blue-400 mt-2 space-y-1">
                <li>• Próbáld újratölteni az oldalt (F5)</li>
                <li>• Töröld a böngésző cache-t</li>
                <li>• Használj Chrome vagy Edge böngészőt</li>
                <li>• Ellenőrizd a mikrofon engedélyeket</li>
              </ul>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
