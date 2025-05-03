import React, { useState } from 'react';

const FolderItem = ({ name, children, onSelect, path = '' }) => {
  const [isOpen, setIsOpen] = useState(false);
  const fullPath = path ? `${path}/${name}` : name;

  const handleClick = () => {
    if (children) {
      setIsOpen(!isOpen);
    } else {
      onSelect(fullPath);
    }
  };

  return (
    <div className="folder-item">
      <div className="folder-header" onClick={handleClick}>
        {children ? (
          <span className={`folder-icon ${isOpen ? 'open' : ''}`}>
            {isOpen ? '📂' : '📁'}
          </span>
        ) : (
          <span className="file-icon">📄</span>
        )}
        <span className="folder-name">{name}</span>
      </div>
      {children && isOpen && (
        <div className="folder-children">
          {React.Children.map(children, child =>
            React.cloneElement(child, { path: fullPath })
          )}
        </div>
      )}
    </div>
  );
};

const FolderStructure = ({ onSelect }) => {
  return (
    <div className="folder-structure">
      <FolderItem name="Projects" onSelect={onSelect}>
        <FolderItem name="Superbook-CBN" onSelect={onSelect} />
        <FolderItem name="Aadujeevitham" onSelect={onSelect} />
        <FolderItem name="AR-Rahman-Collab" onSelect={onSelect} />
      </FolderItem>
      <FolderItem name="Experience" onSelect={onSelect}>
        <FolderItem name="Fingent" onSelect={onSelect} />
        <FolderItem name="Engati" onSelect={onSelect} />
        <FolderItem name="TCS" onSelect={onSelect} />
      </FolderItem>
    </div>
  );
};

export default FolderStructure; 