import { ClassifierModel, Finding, DetectionOptions } from '../types';
import { getLocalClassifier, LocalNLPClassifier } from './localClassifier';

export interface ClassifierEngine {
  getModel(): ClassifierModel;
  detect(text: string, options?: DetectionOptions): Finding[];
}

/**
 * Adapter ensuring compatibility for future ONNX runtime or Transformers.js models
 */
class DefaultClassifierEngine implements ClassifierEngine {
  private localModel: LocalNLPClassifier;

  constructor() {
    this.localModel = getLocalClassifier();
  }

  public getModel(): ClassifierModel {
    return this.localModel;
  }

  public detect(text: string, options?: DetectionOptions): Finding[] {
    return this.localModel.detect(text, options);
  }
}

let engineInstance: ClassifierEngine | null = null;

export function getClassifierEngine(): ClassifierEngine {
  if (!engineInstance) {
    engineInstance = new DefaultClassifierEngine();
  }
  return engineInstance;
}

export { LocalNLPClassifier, getLocalClassifier };
