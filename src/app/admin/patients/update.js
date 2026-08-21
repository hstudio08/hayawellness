const fs = require('fs');

const path = 'e:\\webdevelopment\\hayawellness\\src\\app\\admin\\patients\\page.tsx';
let content = fs.readFileSync(path, 'utf8');

// Replace state
content = content.replace(
  'const [showAllPatients, setShowAllPatients] = useState(false);',
  `const [brillianceMode, setBrillianceMode] = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem("hayawellness_brillianceMode");
    if (saved === "true") setBrillianceMode(true);
  }, []);

  const toggleBrillianceMode = (val: boolean) => {
    setBrillianceMode(val);
    localStorage.setItem("hayawellness_brillianceMode", String(val));
  };`
);

// Replace filtered logic
content = content.replace(
  'if (!showAllPatients && !q) return [];',
  'if (brillianceMode && !q) return [];'
);

content = content.replace(
  'showAllPatients]',
  'brillianceMode]'
);

// Replace UI
content = content.replace(
  /<div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 w-full lg:w-auto">[\s\S]*?<\/div>\s*<\/div>\s*<\/div>/,
  `<div className={\`flex flex-col sm:flex-row items-stretch sm:items-center gap-3 w-full \${brillianceMode ? 'lg:w-[60vw]' : 'lg:w-auto'}\`}>
          {/* Search */}
          <div className={\`relative flex-1 transition-all duration-300 \${brillianceMode ? 'lg:min-w-[50vw]' : 'sm:min-w-[250px] lg:min-w-[300px]'}\`}>
            <Search className={\`absolute left-4 top-1/2 -translate-y-1/2 \${brillianceMode ? 'w-5 h-5 text-emerald-teal' : 'w-4 h-4 text-gray-400'}\`} />
            <input 
              type="text" 
              placeholder="Global Search (Name, Phone, Email, Messages)..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className={\`w-full pl-11 pr-4 py-3 text-sm border-2 rounded-2xl focus:outline-none transition-all duration-300 \${brillianceMode ? 'border-emerald-teal/50 shadow-[0_0_15px_rgba(4,114,77,0.2)] bg-white/90 backdrop-blur focus:border-emerald-teal focus:shadow-[0_0_20px_rgba(4,114,77,0.4)]' : 'border-gray-200 focus:border-emerald-teal bg-white'}\`}
            />
          </div>
          
          <button 
            onClick={() => toggleBrillianceMode(!brillianceMode)}
            className={\`flex items-center gap-2 px-4 py-3 rounded-2xl border-2 transition-all font-oswald uppercase tracking-wider text-xs whitespace-nowrap \${brillianceMode ? 'border-emerald-teal bg-emerald-teal text-white shadow-lg' : 'border-gray-200 bg-white text-gray-500 hover:border-gray-300'}\`}
          >
            <span className={\`w-2 h-2 rounded-full \${brillianceMode ? 'bg-white animate-pulse' : 'bg-gray-300'}\`}></span>
            Brilliance Mode
          </button>
          
          {/* Sort */}
          <div className={\`bg-white border-2 border-gray-200 rounded-2xl overflow-hidden flex items-center shrink-0 transition-opacity duration-300 \${brillianceMode ? 'opacity-50 hover:opacity-100' : 'opacity-100'}\`}>
            <span className="pl-3 pr-2 py-3 text-xs font-medium font-oswald tracking-wide text-gray-400 uppercase border-r border-gray-100 bg-gray-50">Sort</span>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              className="px-3 py-3 text-sm font-sans text-emerald-deep bg-white focus:outline-none cursor-pointer border-r border-gray-100"
            >
              <option value="appointment">Appt Date</option>
              <option value="booking">Booking Date</option>
              <option value="name">Alphabetical</option>
            </select>
            <select
              value={sortOrder}
              onChange={(e) => setSortOrder(e.target.value as any)}
              className="px-3 py-3 text-sm font-sans text-emerald-deep bg-white focus:outline-none cursor-pointer"
            >
              <option value="desc">Desc</option>
              <option value="asc">Asc</option>
            </select>
          </div>
        </div>
      </div>`
);

content = content.replace(
  `<div className="py-16 text-center bg-white border border-gray-100 rounded-2xl">
            <p className="text-lg font-fredoka text-emerald-deep mb-2">No patients found</p>
            <p className="text-sm font-sans text-text-muted">Try adjusting your search filters.</p>
          </div>`,
  `{brillianceMode && !searchQuery ? (
          <div className="py-20 text-center flex flex-col items-center justify-center space-y-4">
             <div className="w-16 h-16 rounded-full bg-emerald-soft flex items-center justify-center animate-pulse">
               <Search className="w-8 h-8 text-emerald-teal" />
             </div>
             <p className="text-xl font-fredoka text-emerald-deep">Brilliance Mode Active</p>
             <p className="text-sm font-sans text-text-muted max-w-md mx-auto">Patients are hidden to maintain a clean workspace. Use the search bar above to instantly find any patient record by name, phone, email, or message.</p>
          </div>
        ) : (
          <div className="py-16 text-center bg-white border border-gray-100 rounded-2xl">
            <p className="text-lg font-fredoka text-emerald-deep mb-2">No patients found</p>
            <p className="text-sm font-sans text-text-muted">Try adjusting your search filters.</p>
          </div>
        )}`
);

fs.writeFileSync(path, content);
console.log('done');
