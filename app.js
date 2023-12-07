// DOM Selectors
const blogTextParent = document.querySelector('#blog-text-parent');
const textGeneratorForm = document.querySelector('#text-generator');
const textInput = document.querySelector('#text-input');
const selectionWindow = document.querySelector('#selection-window');
const searchedKeyword = document.querySelector('#keyword');
const headingOne = document.querySelector('#heading-one');
const paragraph = document.querySelector('#paragraph');
const selectItems = document.querySelectorAll('.select-item');
const selectedItemParent = document.querySelector('#selected-item-parent');

// State
let currentH1 = null;

// Helper Functions
const show = (element) => {
  element.style.opacity = 1;
  element.style.zIndex = 1;
  element.style.display = 'block';
};

const hide = (element) => {
  element.style.opacity = 0;
  element.style.zIndex = -1;
  element.style.display = 'none';
};

const preventNewLine = (e) => {
  if (e.key === 'Enter' || e.keyCode === 13) {
    e.preventDefault();
    if (currentH1) {
      currentH1.blur();
    }
    show(textGeneratorForm);
    textInput.focus();
  }
};

const showOptionsMenu = () => {
  const optionsMenuIcons = document.querySelectorAll('.option-menu-icon');
  optionsMenuIcons.forEach((menuIcon) => {
    menuIcon.addEventListener('click', (e) => {
      show(e.target.nextElementSibling);
    });
  });
};

const handleDeleteItem = () => {
  const deleteItems = document.querySelectorAll('.delete-item');
  deleteItems.forEach((delItem) => {
    delItem.addEventListener('click', (e) => {
      const elementParent = e.target.parentElement.parentElement.parentElement;
      elementParent.remove();
      show(textGeneratorForm);
      textInput.focus();
    });
  });
};

const showTagsMenu = () => {
  const tagsOptionsSelect = document.querySelectorAll('.turn-into');
  const tagsLists = document.querySelectorAll('.tags-list');

  tagsOptionsSelect.forEach((tagOption, index) => {
    tagOption.addEventListener('mouseenter', () => {
      const currentTagsList = tagsLists[index];
      currentTagsList.classList.add('tags-list-reveal');
      show(currentTagsList);
    });
  });
};

const handleTagChange = () => {
  const tagOptions = document.querySelectorAll('.tag-option');

  tagOptions.forEach((tag, index) => {
    tag.addEventListener('click', (e) => onClickTagOption(e, index));
  });
};

const onClickTagOption = (e, index) => {
  const tagType = e.currentTarget.attributes.dataset.value;
  const currentTag = e.currentTarget.closest('.content-container').children[1];

  if (currentTag) {
    const newTag = document.createElement(tagType);
    newTag.innerHTML = currentTag.innerHTML;
    newTag.classList.add(`${tagType}-${index}`);
    newTag.setAttribute('spellcheck', 'true');
    newTag.setAttribute('contenteditable', 'true');
    newTag.setAttribute('autofocus', '');
    newTag.addEventListener('keyup', (event) => {
      if (event.key === 'Enter' || event.keyCode === 13) {
        event.preventDefault();
        newTag.blur();
        show(textGeneratorForm);
        textInput.focus();
      }
    });
    currentTag.parentNode.replaceChild(newTag, currentTag);
    hide(e.target.closest('.option-menu'));
    hide(e.target.closest('.option-menu').querySelector('.tags-list'));
  }
};

// Document Click Event
document.addEventListener('click', (event) => {
  const optionMenus = document.querySelectorAll('.option-menu');

  optionMenus.forEach((optionMenu) => {
    const isClickInsideContextMenu = optionMenu.contains(event.target);
    if (
      !isClickInsideContextMenu &&
      !event.target.classList.contains('option-menu-icon')
    ) {
      hide(optionMenu);
      hide(optionMenu.querySelector('.tags-list'));
    }
  });
});

// Event Listeners
textGeneratorForm.addEventListener('submit', (e) => {
  e.preventDefault();
});

textInput.addEventListener('input', (e) => {
  searchedKeyword.innerText = e.target.value;
  switch (e.target.value) {
    case '/':
      show(selectionWindow);
      headingOne.style.display = 'none';
      paragraph.style.display = 'none';
      break;
    case '/1':
      show(selectionWindow);
      headingOne.style.display = 'flex';
      break;
    case '/p':
      show(selectionWindow);
      paragraph.style.display = 'flex';
      break;
    default:
      selectionWindow.style.opacity = 0;
      selectionWindow.style.zIndex = 0;
      headingOne.style.display = 'none';
      paragraph.style.display = 'none';
  }
});

// Tag generator
selectItems.forEach((select, index) => {
  select.addEventListener('click', () => {
    const tagName = select.attributes.dataset.value;

    const newContentContainer = document.createElement('div');
    newContentContainer.classList.add('content-container');
    newContentContainer.innerHTML = `
      <div>
        <img class="option-menu-icon" src="./images/CiHamburger.svg" />
        <div class="option-menu">
          <div class="option-item delete-item">
            <img src="./images/BiTrash3.svg" />
            <div>Delete</div>
          </div>
          <div class="option-item turn-into">
            <img src="./images/change.svg" />
            <div>Turn into</div>
            <img class="option-right-arrow" src="./images/right-arrow.svg" />
            <div class="tags-list">
              <div class="tag-option" dataset="h1">
                <img src="./images/header.png" />
                <div dataset="h1">Heading 1</div>
              </div>
              <div class="tag-option" dataset="p">
                <img src="./images/paragraph-icon.png" />
                <div dataset="p">Paragraph</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    `;
    selectedItemParent.appendChild(newContentContainer);
    const newTag = document.createElement(tagName);
    newTag.classList.add(`${tagName}-${index}`);
    newTag.setAttribute('spellcheck', 'true');
    newTag.setAttribute('contenteditable', 'true');
    newTag.setAttribute('autofocus', '');
    newTag.addEventListener('keyup', preventNewLine);

    newContentContainer.appendChild(newTag);

    showOptionsMenu();
    handleDeleteItem();
    showTagsMenu();
    handleTagChange();

    setTimeout(() => {
      newTag.focus();
    }, 100);

    textInput.value = '';
    hide(selectionWindow);
    hide(textGeneratorForm);
  });
});
