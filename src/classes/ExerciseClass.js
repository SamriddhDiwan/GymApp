export default class Exercise {
    constructor(ex) {
        this._exerciseName = ex.name;
        this._exerciseDescription = ex.description;
        this._exerciseHowto = ex.howto;
        this._exerciseImage = ex.exerciseImage;
        this._exerciseVideoTutorial = ex.videoTutorial;
        this._exerciseSet=[];
    }
    get exerciseName() {
        return this._exerciseName;
    }
    set exerciseName(value) {
        this._exerciseName = value;
    }
    get exerciseDescription() {
        return this._exerciseDescription;
    }
    set exerciseDescription(value) {
        this._exerciseDescription = value;
    }
    get exerciseHowto() {
        return this._exerciseHowto;
    }
    set exerciseHowto(value) {
        this._exerciseHowto = value;
    }
    get exerciseImage() {
        return this._exerciseImage;
    }
    set exerciseImage(value) {
        this._exerciseImage = value;
    }
    get exerciseVideoTutorial() {
        return this._exerciseVideoTutorial;
    }
    set exerciseVideoTutorial(value) {
        this._exerciseVideoTutorial = value;
    }
    get sets() {
        return this._exerciseSet;
    }

    addSet(weight = "", reps = "") {
        this._exerciseSet.push({ weight, reps });
    }

    updateSet(index, field, value) {
        if (this._exerciseSet[index]) {
            this._exerciseSet[index][field] = value;
        }
    }
}