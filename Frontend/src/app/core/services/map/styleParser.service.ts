import { Injectable } from '@angular/core';
import Style from 'ol/style/Style';
import Fill from 'ol/style/Fill';
import Stroke from 'ol/style/Stroke';
import CircleStyle from 'ol/style/Circle';
import Icon from 'ol/style/Icon';
import ImageStyle from 'ol/style/Image';
import RegularShape from 'ol/style/RegularShape';
import Text from 'ol/style/Text';

@Injectable()
class StyleRuleParser {
  ruleObject: any;
  name: any;
  condition: any;
  filters: any;
  check: any;
  constructor(object: any) {
    this.ruleObject = object;
    this.name = object.Name || 'DEFAULT';
    this.condition = object.Condition || 'DEFAULT';
    this.filters = object.Filter || [];
    this.check = this.initTest();
  }

  getStyle(layerId: any, onCheck: any) {
    const style = new OlStyleParser().recursiveStyle(this.ruleObject.style);
    let textFormat = '';
    if (style.getText() && style.getText().getText) {
      textFormat = style.getText().getText();
    }
    return function(feature: any, resolution: any) {
      let isValid = true;
      if (this.check) {
        isValid = this.check(feature);
      }
      if (onCheck && isValid) {
        isValid = onCheck(layerId, feature, resolution);
      }
      if (isValid) {
        if (textFormat) {
          // set text here;
          const text = this.createToolTipDisplay(textFormat, feature);
          style.getText().setText(text);
        }
        return [style];
      }
      return [];
    }.bind(this);
  }

  private initTest() {
    if (this.filters.length === 0) {
      return function() {
        return true;
      };
    }
    const checkFunctions: any[] = [];
    for (let index = 0; index < this.filters.length; index++) {
      const filter = this.filters[index];
      checkFunctions.push(this.initFilterFunction(filter));
    }
    if (this.condition === 'AND') {
      return function(olFeature: any) {
        let isValid = false;
        for (let index = 0; index < checkFunctions.length; index++) {
          isValid = checkFunctions[index](olFeature);
        }
        return isValid;
      };
    }
    if (this.condition === 'OR') {
      return function() {
        let isValid = false;
        for (let index = 0; index < checkFunctions.length; index++) {
          isValid = isValid || checkFunctions[index];
        }
        return isValid;
      };
    }
  }

  private initFilterFunction(filterObject: any) {
    const property = filterObject.PropertyName;
    const value = filterObject.Value;
    const uValue = filterObject.UpperValue;
    const lValue = filterObject.LowerValue;
    const logic = filterObject.LogicType;
    return function(olFeature: any) {
      const fValue = olFeature.get(property);
      if (logic === 'EQUAL') {
        return fValue === value;
      }
      if (logic === 'ISNULL') {
        return !fValue;
      }
      if (logic === 'BETWEEN') {
        return lValue < fValue && fValue < uValue;
      }
      // TODO need support other logic condition (Lowerthan, greaterthan, not equal)
      return false;
    };
  }
}

class OlStyleParser {
  styleMap = {
    style: Style,
    fill: Fill,
    stroke: Stroke,
    circle: CircleStyle,
    icon: Icon,
    image: ImageStyle,
    regularshape: RegularShape,
    text: Text
  };
  constructor() {}

  private optionalFactory(style: any, Constructor: any) {
    if (Constructor && style instanceof Constructor) {
      return style;
    } else if (Constructor) {
      return new Constructor(style);
    } else {
      return style;
    }
  }

  recursiveStyle(data: any, styleName?: any) {
    let style: any;
    if (!styleName) {
      styleName = 'style';
      style = data;
    } else {
      style = data[styleName];
    }

    if (!(style instanceof Object)) {
      return style;
    }

    let styleObject: any;
    if (Object.prototype.toString.call(style) === '[object Object]') {
      styleObject = {};
      const styleConstructor = this.styleMap[styleName];
      if (styleConstructor && style instanceof styleConstructor) {
        return style;
      }
      Object.getOwnPropertyNames(style).forEach(
        function(val: any, idx: any, array: any) {
          // Consider the case
          // image: {
          //  circle: {
          //     fill: {
          //       color: 'red'
          //     }
          //   }
          //
          // An ol.style.Circle is an instance of ol.style.Image, so we do not want to construct
          // an Image and then construct a Circle.  We assume that if we have an instanceof
          // relationship, that the JSON parent has exactly one child.
          // We check to see if an inheritance relationship exists.
          // If it does, then for the parent we create an instance of the child.
          const valConstructor = this.styleMap[val];
          if (styleConstructor && valConstructor && valConstructor.prototype instanceof this.styleMap[styleName]) {
            // console.assert(array.length === 1, 'Extra parameters for ' + styleName);
            styleObject = this.recursiveStyle(style, val);
            return this.optionalFactory(styleObject, valConstructor);
          } else {
            styleObject[val] = this.recursiveStyle(style, val);

            // if the value is 'text' and it contains a String, then it should be interpreted
            // as such, 'cause the text style might effectively contain a text to display
            if (val !== 'text' && typeof styleObject[val] !== 'string') {
              styleObject[val] = this.optionalFactory(styleObject[val], this.styleMap[val]);
            }
          }
        }.bind(this)
      );
    } else {
      styleObject = style;
    }
    return this.optionalFactory(styleObject, this.styleMap[styleName]);
  }
}

export class StyleCollectionParser {
  constructor() {}
  styles: any = {};
  parse(jsonArray: any, onCheck?: any) {
    if (jsonArray.length > 0) {
      for (let index = 0; index < jsonArray.length; index++) {
        const jsonItem = jsonArray[index];
        const layerId = jsonItem.LayerId;
        this.styles[layerId] = [];
        const rules = jsonItem.Rule;
        for (let rindex = 0; rindex < rules.length; rindex++) {
          const r = rules[rindex];
          const ruleStyle = this.parseRule(r, layerId, onCheck);
          this.styles[layerId].push(ruleStyle);
        }
      }
      return this.styles;
    }
  }

  private parseRule(object: any, layerId: any, onCheck: any) {
    const rule = new StyleRuleParser(object);
    const styleFunction = rule.getStyle(layerId, onCheck);
    return styleFunction;
  }
}
