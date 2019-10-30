import { observable, action, IObservableArray } from "mobx";
import uuidv4 from "uuid/v4";
import { toJS } from "mobx";
import { replace } from "connected-react-router";

class Images {
    @observable images = observable([]);
    @observable fontsList = observable([]);
    @observable fonts = observable([]);
    @observable upperZIndex = 1;
    @observable idObjectSelected = null;
    @observable imageSelected = null;
    @observable idObjectHovered = null;
    @observable imageHovered = null;
    @observable activePageId = uuidv4();
    @observable pages = observable([this.activePageId]);
    @observable scale = 1;
  
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
  
    @action addFont = (item) => {
      this.fonts.push(item);
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
      var images = toJS(this.images);
      images = images.filter(image => {
        return image.page !== this.activePageId;
      }) as IObservableArray;
  
      var appendedImages = template.map(img => {
        img._id = uuidv4();
        return img;
      })
  
      images = [...images, ...appendedImages] as IObservableArray;
      this.images.replace(images);
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
  }

  const store = new Images();

export default store;