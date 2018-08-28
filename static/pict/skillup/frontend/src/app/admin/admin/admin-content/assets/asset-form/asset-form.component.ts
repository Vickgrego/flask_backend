import {Component, OnInit, ViewChild} from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormControl } from "@angular/forms";
import { DomSanitizer } from "@angular/platform-browser";
import { TagService } from "../../../../shared/tag.service";
import { AssetsService } from "../../../../shared/assets.service";
import {Router, ActivatedRoute} from "@angular/router";

interface File {
  lastModified: number;
  lastModifiedDate: Date;
  name: string;
  size: number;
  type: string;
  webkitRelativePath: string;
  id?: number;
}

@Component({
  selector: 'app-admin-asset-form',
  templateUrl: './asset-form.component.html',
  styleUrls: ['./asset-form.component.scss']
})

export class AssetFormComponent implements OnInit {
  @ViewChild('fileInput') fileInput;

  form: FormGroup;
  formSubmitted: boolean = false;
  showBtn: boolean = false;
  secondStepId: number = 0;
  editMode: boolean;
  tags: any[];
  tagsFilter: string = "";
  fileList: File[];
  filesToDelete: Array<any>;
  existingFiles: File[];
  thumbnailList: Array<any>;
  thumbnail: any = {
    name: '',
    type: '',
    baseString: '',
    string: ''
  };
  fileTypes: any = [{"id":"File","name":"File"},{"id":"URL","name":"URL"}];
  fileType: string;

  constructor(private fb: FormBuilder,
              private router: Router,
              private route: ActivatedRoute,
              private santizer: DomSanitizer,
              private tagService: TagService,
              private assetsService: AssetsService) {
    this.fileList = [];
    this.filesToDelete = [];
    this.existingFiles = [];
    this.thumbnailList = [];
  }

  ngOnInit() {
    this.tags = this.tagService.tags;
    this.route.url.subscribe(ev => {
      if (ev[0].path == 'edit') {
        this.editMode = true;
        this.secondStepId = parseInt(ev[1].path);
        this.assetsService.getAssetDetails(this.secondStepId).then(resp => {
          this.setForm(resp);
          this.fetchTags(resp);
        })
      } else if (ev[0].path == 'add') {
        this.editMode = false;
        this.fetchTags();
      }
    });


    this.buildForm();
  }

  fetchTags(presetAsset?: any) {
    this.tagService.fetchTags()
      .then((resp: Array<any>) => {
        this.tags = resp.map((el) => {
          el.checked = false;
          return el;
        });
        if (presetAsset && presetAsset.tags) {
          presetAsset.tags.map((el, i) => {
            this.checkTag(el, presetAsset);
            return el
          });
        }
      });
  }

  onTypeChange(ev) {
    this.fileType = ev.target.value;
    this.showBtn = true;
    if (this.fileType == "URL") {
      let pattern = `^(https?:\/\/)?([\da-z\.-]+)\.([a-z\.]{2,6})([\/\w \.-]*)*\/?$`;
      let control: FormControl = new FormControl("", [Validators.required/*, Validators.pattern(pattern)*/]);
      let control1: FormControl = new FormControl("");
      this.form.addControl('youtubeUrl', control);
      this.form.addControl('thumbNailData', control1);
      if (this.editMode) {
        this.form.controls['youtubeUrl'].setValue(ev.target.url);
      }
    } else {
      this.form.removeControl('youtubeUrl');
      this.form.removeControl('thumbNailData');
    }
  }

  filterTags(ev) {
    this.tagsFilter = ev.target.value;
  }

  save(){
    this.formSubmitted = true;

    if (this.form.value.youtubeUrl) {
      var id = this.getEmbedId(this.form.value.youtubeUrl);
      if (id !== 'error') {
        this.form.controls['thumbNailData'].setValue("http://www.youtube.com/embed/" + id);
      }
    }

    console.log(this.form.value);
    if(this.form.valid){
      if (this.editMode) {
        this.editAsset()
      } else {
        this.addAsset()
      }
    }
  }

  private getEmbedId(url) {
    var regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/;
    var match = url.match(regExp);

    if (match && match[2].length == 11) {
      return match[2];
    } else {
      return 'error';
    }
  }

  addAsset() {
    this.assetsService.addAsset(this.form.value).then((resp: any) => {
      if (this.fileType == "URL") {
        this.router.navigate(['admin/assets']);
      }
      this.secondStepId = resp.id;
    });
  }

  editAsset(cb?: any) {
    this.assetsService.editAsset(this.form.value, this.secondStepId).then((resp: any) => {
      if(cb) {
        cb();
      }
      if (this.fileType == "URL") {
        this.router.navigate(['admin/assets']);
      }
    });
  }

  addFiles(val) {
    const formData = new FormData();

    for (var i = 0; i < this.fileInput.nativeElement.files.length; i++) {
      formData.append("FilesToCreate", this.fileInput.nativeElement.files[i]);
    }
    for (var i = 0; i < this.filesToDelete.length; i++) {
      formData.append("FilesToDelete["+i+"].FileId", this.filesToDelete[i].FileId);
    }
    formData.append("Thumbnail.Content", this.thumbnail.baseString);
    formData.append("Thumbnail.ContentType", this.thumbnail.type);
    formData.append("ArchiveFileName", this.thumbnail.name);

    this.assetsService.addFiles(this.secondStepId, formData).then(() => {
      if(!this.form.dirty) {
        this.router.navigate(['admin/assets']);
      } else {
        this.editAsset(() => {
          this.router.navigate(['admin/assets']);
        });
      }
    });
  }

  deleteFile(file, existing) {
    this.fileInput.nativeElement.value = null;
    if (!this.editMode) {
      this.fileList = this.fileList.filter((el) => {
        return el.name !== file.name;
      });
      this.thumbnailList = this.thumbnailList.filter(el => {
        return el.name !== file.name;
      })
    } else {
      if (existing){
        this.filesToDelete.push({"FileId": file.id});
        this.existingFiles = this.existingFiles.filter((el) => {
          return el.id !== file.id;
        });
      } else {
        this.fileList = this.fileList.filter((el) => {
          return el.name !== file.name;
        });
      }
    }
  }

  onChangeFile(event) {
    let target = event.target || event.srcElement;
    this.thumbnailList = [];
    console.log(target.files);
    this.fileList = Object.keys(target.files).map((key) => {
      if (target.files[key].type.indexOf('image/jpeg') >= 0 || target.files[key].type.indexOf('image/png') >= 0) {
        this.thumbnailList.push(target.files[key])
      }
      return target.files[key];
    });
  }
  onChangeThumbnail(event) {
    let target = event.target || event.srcElement;
    let file = target.files[0];
    this.thumbnail.type = file.type;
    this.thumbnail.name = file.name;
    this.getBase64(file);
  }

  selectThumbnail(event) {
    let selected = this.thumbnailList.find(file => {
      return file.name == event.target.value
    });
    this.thumbnail.type = selected.type;
    this.thumbnail.name = selected.name;
    this.getBase64(selected);
  }

  getBase64(file) {
    var reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => {
      this.thumbnail.baseString = reader.result.split('data:'+file.type+';base64,')[1];
      this.thumbnail.string = this.santizer.bypassSecurityTrustResourceUrl(reader.result);
    };
    reader.onerror = (error) => {
      console.log('Error: ', error);
    };
  }

  checkTag(tag, presetAsset?) {
    this.tags = this.tags.map((el) => {
      if (el.id == tag.id || el.id == tag.tagId) {
        el.checked = !el.checked;
      }
      return el;
    });

    let res = this.tags.filter((el) => el.checked);
    res = res.map(el => {
      return {tagId: el.id}
    });

    this.form.controls['tags'].setValue(res);
    if (!presetAsset){
      this.form.controls['tags'].markAsDirty();
    }
  }

  private setForm(asset) {
    this.form.controls['name'].setValue(asset.name);
    this.form.controls['description'].setValue(asset.description);
    this.form.controls['assetType'].setValue(asset.assetType);
    this.form.controls['isActive'].setValue(asset.isActive);
    this.form.controls['isFeatured'].setValue(asset.isFeatured);

    this.thumbnail.baseString = asset['thumbNailData'];
    this.thumbnail.string = this.santizer.bypassSecurityTrustResourceUrl('data:'+asset['thumbNailContentType']+';base64,' + asset['thumbNailData']);

    this.existingFiles = asset.files.map(file => {
      file['name'] = file['originalFileName'];
      file['id'] = file['id'];
      file['type'] = file['contentType'];
      return file
    });

    this.onTypeChange({target: {value: asset.assetType, url: asset['shortUrl']}});
  }

  private buildForm() {
    this.form = this.fb.group({
      name: ['', [Validators.required, Validators.minLength(1), Validators.maxLength(100)]],
      description: ['', [Validators.required, Validators.maxLength(250)]],
      assetType: ['', Validators.required],
      isActive: [false],
      isFeatured: [false],
      tags: [[]]
    });
  }
}
