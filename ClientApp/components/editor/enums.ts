export enum SubType {
    BusinessCardReview = 0,
    FlyerReview = 1,
    PosterReview = 2,
    TrifoldReview = 3,
    Logo = 4,
    AnimatedSocialMedia = 5
}

export enum SidebarTab {
    Image = 1,
    Text = 2,
    Template = 4,
    Background = 8,
    Element = 16,
    Upload = 32,
    Video = 64,
    RemovedBackgroundImage = 128,
    Font = 248,
    Color = 496,
    Emoji = 992,
    Effect = 1984,
    Animation = 3968,
}

export enum Mode {
    CreateDesign = 0,
    CreateTemplate = 1,
    CreateTextTemplate = 2,
    EditTemplate = 3,
    EditTextTemplate = 4,
    EditDesign = 5,
}

export enum TemplateType {
    Template = 1,
    TextTemplate = 2,
    Heading = 3,
    Image = 4,
    Latex = 5,
    BackgroundImage = 6,
    RemovedBackgroundImage = 7,
    UserUpload = 8,
    Video = 9,
    GroupedItem = 10,
    ClipImage = 11,
    Element = 12,
    Gradient = 13,
    UserUploadVideo = 14,
    Grids = 15,
    Shape = 16,
}

export enum SavingState {
    UnsavedChanges = 0,
    SavingChanges = 1,
    ChangesSaved = 2,
}

export enum CanvasType {
    All = 0,
    HoverLayer = 1,
    Download = 2,
    Preview = 3,
}