import { observable, action, IObservableArray } from "mobx";
import uuidv4 from "uuid/v4";
import { toJS } from "mobx";
import { SidebarTab } from "@Components/editor/enums";


const fontColors = [
  "rgb(255, 255, 255)",
  "rgb(239, 66, 71)",
  "rgb(244, 135, 41)",
  "rgb(252, 223, 24)",
  "rgb(5, 170, 91)",
  "rgb(6, 177, 162)",
  "rgb(70, 185, 233)",
  "rgb(90, 53, 148)",
  "rgb(201, 34, 105)",
  "rgb(35, 31, 32)",
];

class Images {
    @observable images = observable([]);
    @observable images2 = observable(new Map());
    @observable pageColor = observable(new Map());
    @observable pageBackgroundImage = observable(new Map());
    @observable fontsList = observable([]);
    @observable childId = null;
    @observable fonts = observable([]);
    @observable upperZIndex = 1;
    @observable idObjectSelected = null;
    @observable imageSelected = null;
    @observable idObjectHovered = null;
    @observable pageId = null;
    @observable imageHovered = null;
    @observable activePageId = uuidv4();
    @observable pages = observable([this.activePageId]);
    @observable keys = observable([0]);
    @observable scale = 1;
    @observable fontColors = observable(fontColors)
    @observable colorPickerVisibility = observable.box(false);
    @observable cropMode = null;
    @observable selectedTab = SidebarTab.Template;
    @observable tReady = false;
    @observable fontId = null;
    @observable effectId = null;
    @observable currentOpacity = 0;
    @observable currentFontSize = 0;
    @observable currentLetterSpacing = 0;
    @observable currentLineHeight = 0;
    @observable subtype = null;

    @action getImageSelected = () => {
      return toJS(this.images2.get(this.idObjectSelected));
  }
  
    @action addItem = (item, isChild) => {
      if (isChild) {
        var images = toJS(this.images);
        images = images.map(img => {
          if (img._id === this.idObjectSelected) {
            img.childId = item._id;
          }
          return img;
        }) as IObservableArray;
        images.push(item);
        this.images.replace(images);
      } else {
        this.images.push(item);
      }
    }

    @action addItem2 = (item, isChild) => {
      if (isChild && this.idObjectSelected) {
        let image = this.images2.get(this.idObjectSelected);
        image.childId = item._id;
        this.images2.set(image._id, image);  
      }

      this.images2.set(item._id, item);
    }
  
    @action addFont = (item) => {
      this.fonts.push(item);
    }

    @action addFontColor = color => {
      this.fontColors.push(color)
    }
  
    @action addFontItem = (item) => {
      this.fontsList.push(item);
    }
  
    @action update = (images) => {
      this.images = images;
    }
  
    @action replaceFirstItem = (image) => {
      this.images[0] = image;
    }
  
    @action increaseUpperzIndex = () => {
      this.upperZIndex = this.upperZIndex + 1;
    }
  
    @action applyTemplate = (template) => {
      let images = Array.from(this.images2.values());
      images.forEach(image => {
        if (image.page == this.activePageId) {
          this.images2.delete(image._id);
        }
      });
      this.pages.forEach((pageId, i) => {
        if (pageId == this.activePageId) {
          this.keys[i] = this.keys[i] + 1;
        }
      });

      template.forEach(img => {
        img._id = uuidv4();
        this.images2.set(img._id, img);
      })
    }

    @action replace = (images) => {
      this.images.replace(images);
    }

    @action doNoObjectSelected = () => {
      this.idObjectHovered = null;
      this.idObjectSelected = null;
      this.imageHovered = null;
      this.imageSelected = null;
    }

    @action toggleColorPickerVisibility = () => {
      this.colorPickerVisibility.set(!this.colorPickerVisibility.get());
    }

    @action setToggleColorPickerVisibility = (value : boolean) => {
      this.colorPickerVisibility.set(value);
    }
  }

  const store = new Images();

export default store;