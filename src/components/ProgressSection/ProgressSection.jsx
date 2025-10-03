// src/components/ProgressSection/ProgressSection.jsx - TAILWIND

const ProgressSection = ({ dictionary, isDemo }) => {
  const completedLessons = Object.keys(dictionary).length;
  const totalWords = Object.values(dictionary).reduce(
    (sum, lesson) => sum + lesson.words.length, 0
  );
  
  const maxLessons = isDemo ? 2 : completedLessons + 10; 
  const progress = isDemo 
    ? (completedLessons / 2 * 100).toFixed(1)
    : completedLessons > 0 ? 100 : 0; 

  return (
    <div className="bg-gray-50 dark:bg-slate-800 
                    p-5 border-b-2 
                    border-gray-200 dark:border-slate-700
                    transition-all duration-300">
      {/* Stats Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-5">
        {isDemo ? (
          <>
            <div className="bg-white dark:bg-slate-700 
                          p-4 rounded-lg shadow-md
                          transition-all duration-300">
              <div className="text-3xl font-bold text-blue-500 dark:text-blue-400">
                2
              </div>
              <div className="text-sm text-gray-600 dark:text-gray-400">
                Demo órák
              </div>
            </div>
            <div className="bg-white dark:bg-slate-700 
                          p-4 rounded-lg shadow-md
                          transition-all duration-300">
              <div className="text-3xl font-bold text-blue-500 dark:text-blue-400">
                {completedLessons}
              </div>
              <div className="text-sm text-gray-600 dark:text-gray-400">
                Elérhető
              </div>
            </div>
          </>
        ) : (
          <>
            <div className="bg-white dark:bg-slate-700 
                          p-4 rounded-lg shadow-md
                          transition-all duration-300">
              <div className="text-3xl font-bold text-blue-500 dark:text-blue-400">
                {completedLessons}
              </div>
              <div className="text-sm text-gray-600 dark:text-gray-400">
                Létrehozott órák
              </div>
            </div>
            <div className="bg-white dark:bg-slate-700 
                          p-4 rounded-lg shadow-md
                          transition-all duration-300">
              <div className="text-3xl font-bold text-blue-500 dark:text-blue-400">
                ∞
              </div>
              <div className="text-sm text-gray-600 dark:text-gray-400">
                Lehetséges órák
              </div>
            </div>
          </>
        )}
        
        <div className="bg-white dark:bg-slate-700 
                      p-4 rounded-lg shadow-md
                      transition-all duration-300">
          <div className="text-3xl font-bold text-blue-500 dark:text-blue-400">
            {totalWords}
          </div>
          <div className="text-sm text-gray-600 dark:text-gray-400">
            Összes szó
          </div>
        </div>
        
        <div className="bg-white dark:bg-slate-700 
                      p-4 rounded-lg shadow-md
                      transition-all duration-300">
          <div className={`font-bold text-blue-500 dark:text-blue-400
                        ${completedLessons === 0 && !isDemo ? 'text-2xl' : 'text-3xl'}`}>
            {completedLessons === 0 && !isDemo 
              ? 'Kezdj el!' 
              : isDemo 
                ? `${progress}%` 
                : `${completedLessons} óra`}
          </div>
          <div className="text-sm text-gray-600 dark:text-gray-400">
            {isDemo ? 'Demo haladás' : 'Saját haladás'}
          </div>
        </div>
      </div>
      
      {/* Progress Bar (Demo only) */}
      {isDemo && (
        <>
          <div className="bg-gray-300 dark:bg-slate-700 
                        rounded-full h-2 overflow-hidden mb-3
                        transition-all duration-300">
            <div 
              className="bg-gradient-to-r from-blue-400 to-cyan-400
                       dark:from-purple-600 dark:to-indigo-600
                       h-full transition-all duration-300"
              style={{ width: `${progress}%` }}
            />
          </div>
          <div className="text-center mt-3 text-sm text-gray-600 dark:text-gray-400">
            Demo módban csak 2 óra érhető el. Jelentkezz be a teljes funkcionalitásért!
          </div>
        </>
      )}
      
      {/* Info Messages */}
      {!isDemo && completedLessons > 0 && (
        <div className="text-center mt-3 text-sm text-gray-600 dark:text-gray-400">
          Gratulálunk! {completedLessons} órát hoztál létre {totalWords} szóval. 
          Folytasd a tanulást!
        </div>
      )}
      
      {!isDemo && completedLessons === 0 && (
        <div className="bg-yellow-50 dark:bg-yellow-900/20 
                      border border-yellow-200 dark:border-yellow-700
                      rounded-lg p-4 mt-4
                      transition-all duration-300">
          <strong className="text-gray-900 dark:text-gray-100">
            👋 Üdvözlünk!
          </strong>
          <br />
          <small className="text-gray-700 dark:text-gray-300">
            Kezdd el építeni saját szótáradat! Kattints a "Szavak hozzáadása" 
            gombra az első óra létrehozásához.
          </small>
        </div>
      )}
    </div>
  );
};

export default ProgressSection;
