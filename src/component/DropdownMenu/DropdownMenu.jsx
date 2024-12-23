

export const DropdownMenu = ({onDelete, text="Delete"}) => {
    return (
      <div className="relative" onClick={(e) => e.stopPropagation()}>
        {/* More Icon */}
  
        {/* Dropdown Menu */}
          <div className="absolute right-0 mt-4 w-48 bg-white border border-gray-200 rounded-md shadow-lg z-10">
            <ul className="py-1 text-gray-700">
              {/*         
              <li>
                <button
                  className="block w-full text-left px-4 py-2 hover:bg-gray-100"
                  onClick={() => console.log('Duplicate')}
                >
                  Duplicate
                </button>
              </li> */}
              <li>
                <button
                  className="block w-full text-left px-4 py-2 hover:bg-gray-100"
                  onClick={onDelete}
                >
                  {text}
                </button>
              </li>
  
              {/* <li>
                <button
                  className="block w-full text-left px-4 py-2 hover:bg-gray-100"
                  onClick={() => console.log('Copy to Venue')}
                >
                  Copy to Venue
                </button>
              </li> */}
            </ul>
          </div>
       
      </div>
    );
  };