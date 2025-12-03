(function (thisObj) {// ----- EXTENDSCRIPT INCLUDES ------ //("object" != typeof JSON && (JSON = {}),
  (function () {
    "use strict";
    var rx_one = /^[\],:{}\s]*$/,
      rx_two = /\\(?:["\\\/bfnrt]|u[0-9a-fA-F]{4})/g,
      rx_three =
        /"[^"\\\n\r]*"|true|false|null|-?\d+(?:\.\d*)?(?:[eE][+\-]?\d+)?/g,
      rx_four = /(?:^|:|,)(?:\s*\[)+/g,
      rx_escapable =
        /[\\\"\u0000-\u001f\u007f-\u009f\u00ad\u0600-\u0604\u070f\u17b4\u17b5\u200c-\u200f\u2028-\u202f\u2060-\u206f\ufeff\ufff0-\uffff]/g,
      rx_dangerous =
        /[\u0000\u00ad\u0600-\u0604\u070f\u17b4\u17b5\u200c-\u200f\u2028-\u202f\u2060-\u206f\ufeff\ufff0-\uffff]/g,
      gap,
      indent,
      meta,
      rep;
    function f(t) {
      return t < 10 ? "0" + t : t;
    }
    function this_value() {
      return this.valueOf();
    }
    function quote(t) {
      return (
        (rx_escapable.lastIndex = 0),
        rx_escapable.test(t)
          ? '"' +
            t.replace(rx_escapable, function (t) {
              var e = meta[t];
              return "string" == typeof e
                ? e
                : "\\u" + ("0000" + t.charCodeAt(0).toString(16)).slice(-4);
            }) +
            '"'
          : '"' + t + '"'
      );
    }
    function str(t, e) {
      var r,
        n,
        o,
        u,
        f,
        a = gap,
        i = e[t];
      switch (
        (i &&
          "object" == typeof i &&
          "function" == typeof i.toJSON &&
          (i = i.toJSON(t)),
        "function" == typeof rep && (i = rep.call(e, t, i)),
        typeof i)
      ) {
        case "string":
          return quote(i);
        case "number":
          return isFinite(i) ? String(i) : "null";
        case "boolean":
        case "null":
          return String(i);
        case "object":
          if (!i) return "null";
          if (
            ((gap += indent),
            (f = []),
            "[object Array]" === Object.prototype.toString.apply(i))
          ) {
            for (u = i.length, r = 0; r < u; r += 1) f[r] = str(r, i) || "null";
            return (
              (o =
                0 === f.length
                  ? "[]"
                  : gap
                    ? "[\n" + gap + f.join(",\n" + gap) + "\n" + a + "]"
                    : "[" + f.join(",") + "]"),
              (gap = a),
              o
            );
          }
          if (rep && "object" == typeof rep)
            for (u = rep.length, r = 0; r < u; r += 1)
              "string" == typeof rep[r] &&
                (o = str((n = rep[r]), i)) &&
                f.push(quote(n) + (gap ? ": " : ":") + o);
          else
            for (n in i)
              Object.prototype.hasOwnProperty.call(i, n) &&
                (o = str(n, i)) &&
                f.push(quote(n) + (gap ? ": " : ":") + o);
          return (
            (o =
              0 === f.length
                ? "{}"
                : gap
                  ? "{\n" + gap + f.join(",\n" + gap) + "\n" + a + "}"
                  : "{" + f.join(",") + "}"),
            (gap = a),
            o
          );
      }
    }
    ("function" != typeof Date.prototype.toJSON &&
      ((Date.prototype.toJSON = function () {
        return isFinite(this.valueOf())
          ? this.getUTCFullYear() +
              "-" +
              f(this.getUTCMonth() + 1) +
              "-" +
              f(this.getUTCDate()) +
              "T" +
              f(this.getUTCHours()) +
              ":" +
              f(this.getUTCMinutes()) +
              ":" +
              f(this.getUTCSeconds()) +
              "Z"
          : null;
      }),
      (Boolean.prototype.toJSON = this_value),
      (Number.prototype.toJSON = this_value),
      (String.prototype.toJSON = this_value)),
      "function" != typeof JSON.stringify &&
        ((meta = {
          "\b": "\\b",
          "\t": "\\t",
          "\n": "\\n",
          "\f": "\\f",
          "\r": "\\r",
          '"': '\\"',
          "\\": "\\\\",
        }),
        (JSON.stringify = function (t, e, r) {
          var n;
          if (((gap = ""), (indent = ""), "number" == typeof r))
            for (n = 0; n < r; n += 1) indent += " ";
          else "string" == typeof r && (indent = r);
          if (
            ((rep = e),
            e &&
              "function" != typeof e &&
              ("object" != typeof e || "number" != typeof e.length))
          )
            throw new Error("JSON.stringify");
          return str("", { "": t });
        })),
      "function" != typeof JSON.parse &&
        (JSON.parse = function (text, reviver) {
          var j;
          function walk(t, e) {
            var r,
              n,
              o = t[e];
            if (o && "object" == typeof o)
              for (r in o)
                Object.prototype.hasOwnProperty.call(o, r) &&
                  (void 0 !== (n = walk(o, r)) ? (o[r] = n) : delete o[r]);
            return reviver.call(t, e, o);
          }
          if (
            ((text = String(text)),
            (rx_dangerous.lastIndex = 0),
            rx_dangerous.test(text) &&
              (text = text.replace(rx_dangerous, function (t) {
                return (
                  "\\u" + ("0000" + t.charCodeAt(0).toString(16)).slice(-4)
                );
              })),
            rx_one.test(
              text
                .replace(rx_two, "@")
                .replace(rx_three, "]")
                .replace(rx_four, "")
            ))
          )
            return (
              (j = eval("(" + text + ")")),
              "function" == typeof reviver ? walk({ "": j }, "") : j
            );
          throw new SyntaxError("JSON.parse");
        }));
  })());
/*************************************************************************
* ADOBE CONFIDENTIAL
* ___________________
*
* Copyright 2020 Adobe
* All Rights Reserved.
*
* NOTICE: Adobe permits you to use, modify, and distribute this file in
* accordance with the terms of the Adobe license agreement accompanying
* it. If you have received this file from a source other than Adobe,
* then your use, modification, or distribution of it requires the prior
* written permission of Adobe.
**************************************************************************/

// time display types

var TIMEDISPLAY_24Timecode				= 100;
var TIMEDISPLAY_25Timecode				= 101;
var TIMEDISPLAY_2997DropTimecode		= 102;
var TIMEDISPLAY_2997NonDropTimecode		= 103;
var TIMEDISPLAY_30Timecode				= 104;
var TIMEDISPLAY_50Timecode				= 105;
var TIMEDISPLAY_5994DropTimecode		= 106;
var TIMEDISPLAY_5994NonDropTimecode		= 107;
var TIMEDISPLAY_60Timecode				= 108;
var TIMEDISPLAY_Frames					= 109;
var TIMEDISPLAY_23976Timecode			= 110;
var TIMEDISPLAY_16mmFeetFrames			= 111;
var TIMEDISPLAY_35mmFeetFrames			= 112;
var TIMEDISPLAY_48Timecode				= 113;
var TIMEDISPLAY_AudioSamplesTimecode	= 200;
var TIMEDISPLAY_AudioMsTimecode			= 201;

var KF_Interp_Mode_Linear				= 0;
var KF_Interp_Mode_Hold					= 4;
var KF_Interp_Mode_Bezier				= 5;
var KF_Interp_Mode_Time					= 6;

// field type constants

var FIELDTYPE_Progressive	= 0;
var FIELDTYPE_UpperFirst	= 1;
var FIELDTYPE_LowerFirst	= 2;

// audio channel types

var AUDIOCHANNELTYPE_Mono			= 0;
var AUDIOCHANNELTYPE_Stereo			= 1;
var AUDIOCHANNELTYPE_51				= 2;
var AUDIOCHANNELTYPE_Multichannel	= 3;
var AUDIOCHANNELTYPE_4Channel		= 4;
var AUDIOCHANNELTYPE_8Channel		= 5;

// vr projection type

var VRPROJECTIONTYPE_None				= 0;
var VRPROJECTIONTYPE_Equirectangular	= 1;

// vr stereoscopic type

var VRSTEREOSCOPICTYPE_Monoscopic		= 0;
var VRSTEREOSCOPICTYPE_OverUnder		= 1;
var VRSTEREOSCOPICTYPE_SideBySide		= 2;

// constants used when clearing cache

var MediaType_VIDEO		= "228CDA18-3625-4d2d-951E-348879E4ED93"; // Magical constants from Premiere Pro's internal automation.
var MediaType_AUDIO		= "80B8E3D5-6DCA-4195-AEFB-CB5F407AB009";
var MediaType_ANY		= "FFFFFFFF-FFFF-FFFF-FFFF-FFFFFFFFFFFF";

var MediaType_Audio = 0;	// Constants for working with setting value.
var MediaType_Video = 1;

var Colorspace_601 		= 0;
var Colorspace_709 		= 1;
var Colorspace_2020		= 2;
var Colorspace_2100HLG	= 3;

var BitPrecision_8bit	= 0;
var BitPrecision_10bit	= 1;
var BitPrecision_Float	= 2;
var BitPrecision_HDR	= 3;

var NOT_SET = "-400000";

// Polyfill for Object.keys (ExtendScript doesn't support ES5)
if (!Object.keys) {
	Object.keys = function(obj) {
		if (obj !== Object(obj)) {
			throw new TypeError('Object.keys called on a non-object');
		}
		var keys = [], prop;
		for (prop in obj) {
			if (obj.hasOwnProperty(prop)) {
				keys.push(prop);
			}
		}
		return keys;
	};
}

$._PPP_={

	getVersionInfo : function () {
		return 'PPro ' + app.version + 'x' + app.build;
	},

	getUserName : function () {
		var userName	= "User name not found.";
		var homeDir		= new File('~/');
		if (homeDir) {
			userName = homeDir.displayName;
			homeDir.close();
		}
		return userName;
	},

	keepPanelLoaded : function () {
		app.setExtensionPersistent("com.adobe.PProPanel", 0); // 0, while testing (to enable rapid reload); 1 for "Never unload me, even when not visible."
	},

	updateAllProjectItems : function () {
		var numItems = app.project.rootItem.children.numItems;
		for (var i = 0; i < numItems; i++) {
			var currentItem = app.project.rootItem.children[i];
			if (currentItem) {
				currentItem.refreshMedia();
			}
		}
	},

	getSep : function () {
		if (Folder.fs === 'Macintosh') {
			return '/';
		} else {
			return '\\';
		}
	},

	saveProject : function () {
		app.project.save();
	},

	exportCurrentFrameAsPNG : function (presetPath) {
		var seq = app.project.activeSequence;
		if (seq) {
			var currentSeqSettings	= app.project.activeSequence.getSettings();
			if (currentSeqSettings){
				var currentTime	= seq.getPlayerPosition();
				if (currentTime){
					var oldInPoint 			= seq.getInPointAsTime();
					var oldOutPoint 		= seq.getOutPointAsTime();
					var offsetTime 			= currentTime.seconds + 0.033;  // Todo: Add fancy timecode math, to get one frame, given current sequence timebase
					
					seq.setInPoint(currentTime.seconds);
					seq.setOutPoint(offsetTime);

					// Create a file name, based on timecode of frame.
					var timeAsText				= currentTime.getFormatted(currentSeqSettings.videoFrameRate, app.project.activeSequence.videoDisplayFormat);
					var removeThese 			= /:|;/ig; 				// Why? Because Windows chokes on colons in file names.
					var tidyTime 				= timeAsText.replace(removeThese, '_');
					var outputPathInToOut 		= new File("~/Desktop/output/in_to_out");
					var outputFileNameInToOut	= outputPathInToOut.fsName + $._PPP_.getSep() + seq.name + '___' + tidyTime  + '___' + ".png";

					var removeUponCompletion 	= 1;
					var startQueueImmediately 	= false;
					var jobID_InToOut 			= app.encoder.encodeSequence(	seq, 
																				outputFileNameInToOut, 
																				presetPath, 
																				app.encoder.ENCODE_IN_TO_OUT, 
																				removeUponCompletion,
																				startQueueImmediately);
					
					// put in and out points back where we found them.

					seq.setInPoint(oldInPoint.seconds);
					seq.setOutPoint(oldOutPoint.seconds);
				}
			}
		}
	},

	renameProjectItem : function () {
		var item = app.project.rootItem.children[0]; // assumes the zero-th item in the project is footage.
		if (item) {
			item.name = item.name + ", updated by PProPanel.";
		} else {
			$._PPP_.updateEventPanel("No project items found.");
		}
	},

	getActiveSequenceName : function () {
		if (app.project.activeSequence) {
			return app.project.activeSequence.name;
		} else {
			return "No active sequence.";
		}
	},

	projectPanelSelectionChanged : function (eventObj) { // Note: This message is also triggered when the user opens or creates a new project.
		var message 		= "";
		var projectItems	= eventObj;
		if (projectItems) {
			if (projectItems.length) {
				var remainingArgs	=	projectItems.length;
				var view			=	eventObj.viewID;
				message				=	remainingArgs + " items selected: ";

				for (var i = 0; i < projectItems.length; i++) {		// Concatenate selected project item names, into message.
					message += projectItems[i].name;
					remainingArgs--;
					if (remainingArgs > 1) {
						message += ', ';
					}
					if (remainingArgs === 1) {
						message += ", and ";
					}
					if (remainingArgs === 0) {
						message += ".";
					}
				}
			} else {
				message = 'No items selected.';
			}
		}
		$._PPP_.updateEventPanel(message);
	},

	registerProjectPanelSelectionChangedFxn : function () {
		app.bind("onSourceClipSelectedInProjectPanel", $._PPP_.projectPanelSelectionChanged);
	},

	registerItemsAddedToProjectFxn : function () {
		app.bind("onItemsAddedToProjectSuccess", $._PPP_.onItemsAddedToProject);
	},

	saveCurrentProjectLayout : function () {
		var currentProjPanelDisplay = app.project.getProjectPanelMetadata();
		if (currentProjPanelDisplay) {
			var outFileName			= app.project.name + '_Previous_Project_Panel_Display_Settings.xml';
			var actualProjectPath	= new File(app.project.path);
			var projDir 			= actualProjectPath.parent;
			if (actualProjectPath) {
				var completeOutputPath	= projDir + $._PPP_.getSep() + outFileName;
				var outFile				= new File(completeOutputPath);
				if (outFile) {
					outFile.encoding = "UTF8";
					outFile.open("w", "TEXT", "????");
					outFile.write(currentProjPanelDisplay);
					$._PPP_.updateEventPanel("Saved layout to next to the project.");
					outFile.close();
				}
				actualProjectPath.close();
			}
		} else {
			$._PPP_.updateEventPanel("Could not retrieve current project layout.");
		}
	},

	setProjectPanelMeta : function () {
		var filterString = "";
		if (Folder.fs === 'Windows') {
			filterString = "XML files:*.xml";
		}


		var runningOnWindows = (Folder.fs === 'Windows');

		if (runningOnWindows){
			var fileToOpen = File.openDialog(	"Choose Project panel layout to open.",
												filterString,
												false);
		} else {
			var fileToOpen = File.openDialog(	"Choose Project panel layout to open.",
												checkMacFileType,
												false);
		}

		if (fileToOpen) {
			if (fileToOpen.fsName.indexOf('.xml')) { // We should really be more careful, but hey, it says it's XML!
				fileToOpen.encoding = "UTF8";
				fileToOpen.open("r", "TEXT", "????");
				var fileContents = fileToOpen.read();
				if (fileContents) {
					app.project.setProjectPanelMetadata(fileContents);
					$._PPP_.updateEventPanel("Updated layout from .xml file.");
				}
			}
		} else {
			$._PPP_.updateEventPanel("No valid layout file chosen.");
		}
	},

	exportSequenceAsPrProj : function () {
		var activeSequence	= app.project.activeSequence;
		if (activeSequence) {
			var startTimeOffset	= activeSequence.zeroPoint;
			var prProjExtension	= '.prproj';
			var outputName		= activeSequence.name;
			var outFolder		= Folder.selectDialog();
			if (outFolder) {
				var completeOutputPath = 	outFolder.fsName +
											$._PPP_.getSep() +
											outputName +
											prProjExtension;

				app.project.activeSequence.exportAsProject(completeOutputPath);

				$._PPP_.updateEventPanel("Exported " + app.project.activeSequence.name + " to " + completeOutputPath + ".");
			} else {
				$._PPP_.updateEventPanel("Could not find or create output folder.");
			}

			// Here's how to import N sequences from a project.
			//
			// var seqIDsToBeImported = new Array;
			// seqIDsToBeImported[0] = ID1;
			// ...
			// seqIDsToBeImported[N] = IDN;
			//
			//app.project.importSequences(pathToPrProj, seqIDsToBeImported);

		} else {
			$._PPP_.updateEventPanel("No active sequence.");
		}
	},

	createSequenceMarkers : function () {
		var activeSequence = app.project.activeSequence;
		if (activeSequence) {
			var markers = activeSequence.markers;
			if (markers) {
				var numMarkers = markers.numMarkers;
				if (numMarkers > 0) {
					var marker_index = 1;
					for (var current_marker = markers.getFirstMarker(); current_marker !== undefined; current_marker = markers.getNextMarker(current_marker)) {
						if (current_marker.name !== "") {
							$._PPP_.updateEventPanel('Marker ' + marker_index + ' name = ' + current_marker.name + '.');
						} else {
							$._PPP_.updateEventPanel('Marker ' + marker_index + ' has no name.');
						}
						$._PPP_.updateEventPanel('Marker ' + marker_index + ' GUID = ' + current_marker.guid + '.');

						if (current_marker.end.seconds > 0) {
							$._PPP_.updateEventPanel('Marker ' + marker_index + ' duration = ' + (current_marker.end.seconds - current_marker.start.seconds) + ' seconds.');
						} else {
							$._PPP_.updateEventPanel('Marker ' + marker_index + ' has no duration.');
						}
						$._PPP_.updateEventPanel('Marker ' + marker_index + ' starts at ' + current_marker.start.seconds + ' seconds.');
						marker_index = marker_index + 1;
					}
				}
			}
			var newCommentMarker			= markers.createMarker(12.345);
			newCommentMarker.name			= 'Marker created by PProPanel.';
			newCommentMarker.comments		= 'Here are some comments, inserted by PProPanel.';
			newCommentMarker.end			= (newCommentMarker.seconds + 5.0);

			var newWebMarker				= markers.createMarker(14.345);
			newWebMarker.name				= 'Web marker created by PProPanel.';
			newWebMarker.comments			= 'Here are some comments, inserted by PProPanel.';
			newWebMarker.end				=  (newWebMarker.seconds + 3.0);
			newWebMarker.setTypeAsWebLink("http://www.adobe.com", "frame target");
		} else {
			$._PPP_.updateEventPanel("No active sequence.");
		}
	},

	exportFCPXML : function () {
		if (app.project.activeSequence) {
			var projPath 		= new File(app.project.path);
			var parentDir 		= projPath.parent;
			var outputName 		= app.project.activeSequence.name;
			var xmlExtension 	= '.xml';
			var outputPath 		= Folder.selectDialog("Choose the output directory");

			if (outputPath) {
				var completeOutputPath = outputPath.fsName + $._PPP_.getSep() + outputName + xmlExtension;
				app.project.activeSequence.exportAsFinalCutProXML(completeOutputPath, 1); // 1 == suppress UI
				var info = 	"Exported FCP XML for " +
							app.project.activeSequence.name +
							" to " +
							completeOutputPath +
							".";
				$._PPP_.updateEventPanel(info);
			} else {
				$._PPP_.updateEventPanel("No output path chosen.");
			}
		} else {
			$._PPP_.updateEventPanel("No active sequence.");
		}
	},

	openInSource : function () {
		var filterString = "";
		if (Folder.fs === 'Windows') {
			filterString = "All files:*.*";
		}
		var fileToOpen = File.openDialog("Choose file to open.", filterString, false);
		if (fileToOpen) {

			// It's often desirable to preview media in the source monitor, without forcing the
			// generation of audio peak files. Here's how to do so.

			var property		= 'BE.Prefs.Audio.AutoPeakGeneration';
			var initialValue	= app.properties.getProperty(property);
			var propValue		= false;
			var persistent		= 1;
			var allowToCreate	= true;
			if (initialValue === 'true') {
				app.properties.setProperty('BE.Prefs.Audio.AutoPeakGeneration', propValue, persistent, allowToCreate);
			}

			app.sourceMonitor.openFilePath(fileToOpen.fsName);

			if (initialValue === 'true') {
				app.properties.setProperty(property, initialValue, persistent, allowToCreate);
			}
			app.sourceMonitor.play(1.0); // playback speed as float, 1.0 = normal speed forward
			var position = app.sourceMonitor.getPosition();
			$._PPP_.updateEventPanel("Current Source monitor position: " + position.seconds + " seconds.");

			/* Example code for controlling scrubbing in Source monitor.

			app.enableQE();
			qe.source.player.startScrubbing();
			qe.source.player.scrubTo('00;00;00;11');
			qe.source.player.endScrubbing();
			qe.source.player.step();

			qe.source.player.play(playbackSpeed) // playbackSpeed must be between -4.0 and 4.0

			*/

			fileToOpen.close();
		} else {
			$._PPP_.updateEventPanel("No file chosen.");
		}
	},

	searchForBinWithName : function (nameToFind) {
		// deep-search a folder by name in project
		var deepSearchBin = function (inFolder) {
			if (inFolder && inFolder.name === nameToFind && inFolder.type === 2) {
				return inFolder;
			} else {
				for (var i = 0; i < inFolder.children.numItems; i++) {
					if (inFolder.children[i] && inFolder.children[i].type === 2) {
						var foundBin = deepSearchBin(inFolder.children[i]);
						if (foundBin) {
							return foundBin;
						}
					}
				}
			}
		};
		return deepSearchBin(app.project.rootItem);
	},

	importFiles : function () {
		var filterString = "";
		if (Folder.fs === 'Windows') {
			filterString = "All files:*.*";
		}
		if (app.project) {
			var fileOrFilesToImport = File.openDialog(	"Choose files to import", // title
														filterString, // filter available files?
														true); // allow multiple?
			if (fileOrFilesToImport) {
				// We have an array of File objects; importFiles() takes an array of paths.
				var importThese = [];
				if (importThese) {
					for (var i = 0; i < fileOrFilesToImport.length; i++) {
						importThese[i] = fileOrFilesToImport[i].fsName;
					}
					var suppressWarnings 	= true;
					var importAsStills		= false;
					app.project.importFiles(importThese,
											suppressWarnings,
											app.project.getInsertionBin(),
											importAsStills);
				}
			} else {
				$._PPP_.updateEventPanel("No files to import.");
			}
		}
	},

	muteFun : function () {
		if (app.project.activeSequence) {
			for (var i = 0; i < app.project.activeSequence.audioTracks.numTracks; i++) {
				var currentTrack = app.project.activeSequence.audioTracks[i];
				if (Math.random() > 0.5) {
					var muteState = 0;
					if (currentTrack.isMuted()) {
						muteState = 1;
					}
					currentTrack.setMute(muteState);
				}
			}
		} else {
			$._PPP_.updateEventPanel("No active sequence.");
		}
	},

	disableImportWorkspaceWithProjects : function () {
		var prefToModify 		= 'FE.Prefs.ImportWorkspace';
		var propertyExists 		= app.properties.doesPropertyExist(prefToModify);
		var propertyIsReadOnly 	= app.properties.isPropertyReadOnly(prefToModify);
		var propertyValue 		= app.properties.getProperty(prefToModify);

		app.properties.setProperty(prefToModify, "0", 1, false);
		var safetyCheck	= app.properties.getProperty(prefToModify);
		if (safetyCheck != propertyValue) {
			$._PPP_.updateEventPanel("Changed \'Import Workspaces with Projects\' from " + propertyValue + " to " + safetyCheck + ".");
		}
	},

	setWorkspace : function() {
		var desiredWSName 	= prompt('Which workspace would you like?', 'Editing', 'Which workspace?');
		var workspaces		= app.getWorkspaces();
		var foundIt			= false;
		if (workspaces) {
			$._PPP_.updateEventPanel(workspaces.length + " workspaces found.");
			for (var i = 0; ((i < workspaces.length) && (foundIt === false)); i++) {
				var currentWS = workspaces[i];
				if (currentWS === desiredWSName) {
					app.setWorkspace(currentWS);
					foundIt = true;
					$._PPP_.updateEventPanel("Workspace set to " + currentWS + ".");
				}
			}
			if (foundIt === false) {
				$._PPP_.updateEventPanel("Workspace named " + desiredWSName + " was not found.");
			}
		}
	},

	turnOffStartDialog : function () {
		var prefToModify 		= 'MZ.Prefs.ShowQuickstartDialog';
		var propertyExists 		= app.properties.doesPropertyExist(prefToModify);
		var propertyIsReadOnly 	= app.properties.isPropertyReadOnly(prefToModify);
		var originalValue 		= app.properties.getProperty(prefToModify);

		app.properties.setProperty(prefToModify, "0", 1, true); // optional 4th param:0 = non-persistent,  1 = persistent (default)
		var safetyCheck = app.properties.getProperty(prefToModify);
		if (safetyCheck != originalValue) {
			$._PPP_.updateEventPanel("Start dialog now OFF. Enjoy!");
		} else {
			$._PPP_.updateEventPanel("Start dialog was already OFF.");
		}
	},

	replaceMedia : function () {

		// 	Note: 	This method of changing paths for projectItems is from the time
		//			before PPro supported full-res AND proxy paths for each projectItem.
		//			This can still be used, and will change the hi-res projectItem path, but
		//			if your panel supports proxy workflows, it should rely instead upon
		//			projectItem.setProxyPath() instead.

		var firstProjectItem = app.project.rootItem.children[0];
		if (firstProjectItem) {
			if (firstProjectItem.canChangeMediaPath()) {

				// 	setScaleToFrameSize() ensures that for all clips created from this footage,
				//	auto scale to frame size will be ON, regardless of the current user preference.
				//	This is	important for proxy workflows, to avoid mis-scaling upon replacement.

				//	Addendum: This setting will be in effect the NEXT time the projectItem is added to a
				//	sequence; it will not affect or reinterpret clips from this projectItem, already in
				//	sequences.

				firstProjectItem.setScaleToFrameSize();
				var filterString = "";
				if (Folder.fs === 'Windows') {
					filterString = "All files:*.*";
				}
				var replacementMedia = File.openDialog( "Choose new media file, for " +
														firstProjectItem.name,
														filterString, // file filter
														false); // allow multiple?

				if (replacementMedia) {
					var suppressWarnings 	= true;
					firstProjectItem.name 	= replacementMedia.name + ", formerly known as " + firstProjectItem.name;
					firstProjectItem.changeMediaPath(replacementMedia.fsName, suppressWarnings);
					replacementMedia.close();
				}
			} else {
				$._PPP_.updateEventPanel("Couldn't change path of " + firstProjectItem.name + ".");
			}
		} else {
			$._PPP_.updateEventPanel("No project items found.");
		}
	},

	openProject : function () {
		var filterString = "";
		if (Folder.fs === 'Windows') {
			filterString = "Premiere Pro project files:*.prproj";
		}
		var projToOpen = File.openDialog(	"Choose project:",
											filterString,
											false);
		if ((projToOpen) && projToOpen.exists) {
			app.openDocument(	projToOpen.fsName,	// Path to project
								false,				// suppress 'Convert Project' dialogs?
								false,				// suppress 'Locate Files' dialogs?
								false,				// suppress warning dialogs?
								false);				// prevent document from getting added to MRU list?
			projToOpen.close();
		}
	},

	exportFramesForMarkers : function () {
		var activeSequence = app.project.activeSequence;
		if (activeSequence) {
			var markers 	= activeSequence.markers;
			var markerCount = markers.numMarkers;
			if (markerCount) {
				var firstMarker = markers.getFirstMarker();
				if (firstMarker){
					var previousMarker;
					activeSequence.setPlayerPosition(firstMarker.start.ticks);
					$._PPP_.exportCurrentFrameAsPNG();
					var currentMarker;
					for (var i = 0; i < markerCount; i++) {
						if (i === 0) {
							currentMarker = markers.getNextMarker(firstMarker);
						} else {
							currentMarker = markers.getNextMarker(previousMarker);
						}
						if (currentMarker) {
							activeSequence.setPlayerPosition(currentMarker.start.ticks);
							previousMarker = currentMarker;
							$._PPP_.exportCurrentFrameAsPNG();
						}
					}
				}
			} else {
				$._PPP_.updateEventPanel("No markers applied to " + activeSequence.name + ".");
			}
		} else {
			$._PPP_.updateEventPanel("No active sequence.");
		}
	},

	createSequence : function (name) {
		var someID	= "xyz123";
		var seqName	= prompt('Name of sequence?', '<<<default>>>', 'Sequence Naming Prompt');
		app.project.createNewSequence(seqName, someID);
	},

	createSequenceFromPreset : function (presetPath) {
		app.enableQE();
		var seqName = prompt('Name of sequence?', '<<<default>>>', 'Sequence Naming Prompt');
		if (seqName) {
			qe.project.newSequence(seqName, presetPath);
		}
	},

	transcode : function (outputPresetPath) {
		app.encoder.bind('onEncoderJobComplete', 	$._PPP_.onEncoderJobComplete);
		app.encoder.bind('onEncoderJobError', 		$._PPP_.onEncoderJobError);
		app.encoder.bind('onEncoderJobProgress', 	$._PPP_.onEncoderJobProgress);
		app.encoder.bind('onEncoderJobQueued', 		$._PPP_.onEncoderJobQueued);
		app.encoder.bind('onEncoderJobCanceled', 	$._PPP_.onEncoderJobCanceled);

		var projRoot = app.project.rootItem.children;

		if (projRoot.numItems) {
			var firstProjectItem = app.project.rootItem.children[0];
			if (firstProjectItem) {

				app.encoder.launchEncoder(); // This can take a while; let's get the ball rolling.

				var fileOutputPath = Folder.selectDialog("Choose the output directory");
				if (fileOutputPath) {
					var regExp 		= new RegExp('[.]');
					var outputName 	= firstProjectItem.name.search(regExp);
					if (outputName 	== -1) {
						outputName 	= firstProjectItem.name.length;
					}
					var outFileName			= firstProjectItem.name.substr(0, outputName);
					outFileName				= outFileName.replace('/', '-');
					var completeOutputPath	= fileOutputPath.fsName + $._PPP_.getSep() + outFileName + '.mxf';
					var removeFromQueue		= 1;
					var rangeToEncode		= app.encoder.ENCODE_IN_TO_OUT;

					app.encoder.encodeProjectItem(	firstProjectItem,
													completeOutputPath,
													outputPresetPath,
													rangeToEncode,
													removeFromQueue);
					app.encoder.startBatch();
				}
			} else {
				$._PPP_.updateEventPanel("No project items found.");
			}
		} else {
			$._PPP_.updateEventPanel("Project is empty.");
		}
	},

	transcodeExternal : function (outputPresetPath) {
		app.encoder.launchEncoder();
		var filterString = "";
		if (Folder.fs === 'Windows') {
			filterString = "All files:*.*";
		}
		var fileToTranscode = File.openDialog("Choose file to open.",
			filterString,
			false);
		if (fileToTranscode) {
			var fileOutputPath = Folder.selectDialog("Choose the output directory");
			if (fileOutputPath) {

				var srcInPoint = new Time();
				srcInPoint.seconds = 1.0; // encode start time at 1s (optional--if omitted, encode entire file)
				var srcOutPoint = new Time();
				srcOutPoint.seconds = 3.0; // encode stop time at 3s (optional--if omitted, encode entire file)
				var removeFromQueue = 0;

				var result = app.encoder.encodeFile(fileToTranscode.fsName,
													fileOutputPath.fsName,
													outputPresetPath,
													removeFromQueue,
													srcInPoint,
													srcOutPoint);
			}
		}
	},

	render : function (outputPresetPath) {
		app.enableQE();
		var activeSequence = qe.project.getActiveSequence(); // we use a QE DOM function, to determine the output extension.
		if (activeSequence) {
			var ameInstalled = false;
			var ameStatus = BridgeTalk.getStatus("ame");
			if (ameStatus == "ISNOTINSTALLED") {
				$._PPP_.updateEventPanel("AME is not installed.");
			} else {
				if (ameStatus == 'ISNOTRUNNING') {
					app.encoder.launchEncoder(); // This can take a while; let's get the ball rolling.
				}
				var seqInPointAsTime 	= app.project.activeSequence.getInPointAsTime();
				var seqOutPointAsTime 	= app.project.activeSequence.getOutPointAsTime();
				var useLast 			= false;
				var outputPath = app.encoder.lastExportMediaFolder();
				if (outputPath) {
					useLast = confirm("Use most recent output folder", false, "Use most recent?");
				} else {
					if (useLast === false) {
						var outFolder = Folder.selectDialog("Choose the output directory");
						if (outFolder) {
							outputPath = outFolder.fsName;
						}
					}
				}
				var outPreset = new File(outputPresetPath);
				if (outPreset.exists === true) {
					var outputFormatExtension = activeSequence.getExportFileExtension(outPreset.fsName);
					if (outputFormatExtension) {
						var outputFilename = activeSequence.name + '.' + outputFormatExtension;

						var fullPathToFile = 	outputPath +
												activeSequence.name +
												"." +
												outputFormatExtension;

						var outFileTest = new File(fullPathToFile);
						if (outFileTest.exists) {
							var destroyExisting = confirm("A file with that name already exists; overwrite?", false, "Are you sure...?");
							if (destroyExisting) {
								outFileTest.remove();
								outFileTest.close();
							}
						}

						app.encoder.bind('onEncoderJobComplete', 	$._PPP_.onEncoderJobComplete);
						app.encoder.bind('onEncoderJobError', 		$._PPP_.onEncoderJobError);
						app.encoder.bind('onEncoderJobProgress', 	$._PPP_.onEncoderJobProgress);
						app.encoder.bind('onEncoderJobQueued', 		$._PPP_.onEncoderJobQueued);
						app.encoder.bind('onEncoderJobCanceled', 	$._PPP_.onEncoderJobCanceled);

						app.encoder.setSidecarXMPEnabled(0);	// use these 0 or 1 settings to disable some/all metadata creation.
						app.encoder.setEmbeddedXMPEnabled(0);

						/*
						For reference, here's how to export from within PPro (blocking further user interaction).

						var seq = app.project.activeSequence;

						if (seq) {
							seq.exportAsMediaDirect(fullPathToFile,
													outPreset.fsName,
													app.encoder.ENCODE_WORKAREA);

							Bonus: Here's how to compute a sequence's duration, in ticks. 254016000000 ticks/second.
							var sequenceDuration = app.project.activeSequence.end - app.project.activeSequence.zeroPoint;
						}
						*/

						var removeFromQueueUponSuccess = 1;
						var jobID = app.encoder.encodeSequence(	app.project.activeSequence,
																fullPathToFile,
																outPreset.fsName,
																app.encoder.ENCODE_WORKAREA,
																removeFromQueueUponSuccess);

						$._PPP_.updateEventPanel('jobID = ' + jobID);
						outPreset.close();
					}
				} else {
					$._PPP_.updateEventPanel("Could not find output preset.");
				}
			}
		} else {
			$._PPP_.updateEventPanel("No active sequence.");
		}
	},

	saveProjectCopy : function () {
		var sessionCounter	= 1;
		var originalPath	= app.project.path;
		var outputPath		= Folder.selectDialog("Choose the output directory");

		if (outputPath) {
			var absPath		= outputPath.fsName;
			var outputName	= String(app.project.name);
			var array		= outputName.split('.', 2);

			outputName		= array[0] + sessionCounter + '.' + array[1];
			sessionCounter++;

			var fullOutPath = absPath + $._PPP_.getSep() + outputName;

			app.project.saveAs(fullOutPath);

			for (var a = 0; a < app.projects.numProjects; a++) {
				var currentProject = app.projects[a];
				if (currentProject.path === fullOutPath) {
					// Why do this first? So we don't frighten the user by making PPro's front-most window disappear. :)
					app.openDocument(originalPath, true, true, true, true);
					currentProject.closeDocument();
				}
			}
		} else {
			$._PPP_.updateEventPanel("No output path chosen.");
		}
	},

	mungeXMP : function () {
		var projectItem = app.project.rootItem.children[0]; // assumes first item is footage.
		if (projectItem) {
			if (ExternalObject.AdobeXMPScript === undefined) {
				ExternalObject.AdobeXMPScript = new ExternalObject('lib:AdobeXMPScript');
			}
			if (ExternalObject.AdobeXMPScript !== undefined) {

				var xmpBlob = projectItem.getXMPMetadata();
				var xmp = new XMPMeta(xmpBlob);
				var oldSceneVal = "";
				var oldDMCreatorVal = "";

				if (xmp.doesPropertyExist(XMPConst.NS_DM, "scene") === true) {
					var myScene = xmp.getProperty(XMPConst.NS_DM, "scene");
					oldSceneVal = myScene.value;
				}

				if (xmp.doesPropertyExist(XMPConst.NS_DM, "creator") === true) {
					var myCreator	= xmp.getProperty(XMPConst.NS_DM, "creator");
					oldDMCreatorVal	= myCreator.value;
				}

				// Regardless of whether there WAS scene or creator data, set scene and creator data.

				xmp.setProperty(XMPConst.NS_DM, "scene", oldSceneVal + " Added by PProPanel sample!");
				xmp.setProperty(XMPConst.NS_DM, "creator", oldDMCreatorVal + " Added by PProPanel sample!");

				// That was the NS_DM creator; here's the NS_DC creator.

				var creatorProp 					= "creator";
				var containsDMCreatorValue			= xmp.doesPropertyExist(XMPConst.NS_DC, creatorProp);
				var numCreatorValuesPresent			= xmp.countArrayItems(XMPConst.NS_DC, creatorProp);
				var CreatorsSeparatedBy4PoundSigns	= "";

				if (numCreatorValuesPresent > 0) {

					// If there are existing entries, append
					for (var z = 0; z < numCreatorValuesPresent; z++) {
						CreatorsSeparatedBy4PoundSigns = CreatorsSeparatedBy4PoundSigns + xmp.getArrayItem(XMPConst.NS_DC, creatorProp, z + 1);
						CreatorsSeparatedBy4PoundSigns = CreatorsSeparatedBy4PoundSigns + "####";
					}
					$._PPP_.updateEventPanel(CreatorsSeparatedBy4PoundSigns);

					if (confirm("Replace previous?", false, "Replace existing Creator?")) {
						xmp.deleteProperty(XMPConst.NS_DC, "creator");
					}
					xmp.appendArrayItem(XMPConst.NS_DC, // If no values exist, appendArrayItem will create a value.
										creatorProp,
										numCreatorValuesPresent + " creator values were already present.",
										null,
										XMPConst.ARRAY_IS_ORDERED);
				} else {
					// If this is the first entry, write something else.
					xmp.appendArrayItem(XMPConst.NS_DC,
										creatorProp,
										"PProPanel wrote the first value into NS_DC creator field.",
										null,
										XMPConst.ARRAY_IS_ORDERED);
				}
				var xmpAsString = xmp.serialize(); // either way, serialize and write XMP.
				projectItem.setXMPMetadata(xmpAsString);
			}
		} else {
			$._PPP_.updateEventPanel("Project item required.");
		}
	},

	getProductionByName : function (nameToGet) {
		var production;
		var allProductions = app.anywhere.listProductions();
		for (var i = 0; i < allProductions.numProductions; i++) {
			var currentProduction = allProductions[i];
			if (currentProduction.name === nameToGet) {
				production = currentProduction;
			}
		}
		return production;
	},

	pokeAnywhere : function () {
		var token				= app.anywhere.getAuthenticationToken();
		var productionList		= app.anywhere.listProductions();
		if (app.anywhere.isProductionOpen()) {
			var sessionURL			= app.anywhere.getCurrentEditingSessionURL();
			var selectionURL 		= app.anywhere.getCurrentEditingSessionSelectionURL();
			var activeSequenceURL 	= app.anywhere.getCurrentEditingSessionActiveSequenceURL();
			var theOneIAskedFor		= $._PPP_.getProductionByName("test");
			if (theOneIAskedFor) {
				var out = theOneIAskedFor.name + ", " + theOneIAskedFor.description;
				$._PPP_.updateEventPanel("Found: " + out); // todo: put useful code here.
			}
		} else {
			$._PPP_.updateEventPanel("No Production open.");
		}
	},

	dumpOMF : function () {
		var activeSequence = app.project.activeSequence;
		if (activeSequence) {
			var outputPath = Folder.selectDialog("Choose the output directory");
			if (outputPath) {
				var absPath				= outputPath.fsName;
				var outputName 			= String(activeSequence.name) + '.omf';
				var fullOutPathWithName	= absPath + $._PPP_.getSep() + outputName;

				app.project.exportOMF(	app.project.activeSequence, // sequence
										fullOutPathWithName, 		// output file path
										'OMFTitle', 				// OMF title
										48000, 						// sample rate (48000 or 96000)
										16, 						// bits per sample (16 or 24)
										1, 							// audio encapsulated flag (1:yes or 0:no)
										0, 							// audio file format (0:AIFF or 1:WAV)
										0, 							// trim audio files (0:no or 1:yes)
										0, 							// handle frames (if trim is 1, handle frames from 0 to 1000)
										0); 						// include pan flag (0:no or 1:yes)
			}
		} else {
			$._PPP_.updateEventPanel("No active sequence.");
		}
	},

	addClipMarkers : function () {
		if (app.project.rootItem.children.numItems > 0) {
			var projectItem = app.project.rootItem.children[0]; // assumes first item is footage.
			if (projectItem) {
				if (projectItem.type == ProjectItemType.CLIP || projectItem.type == ProjectItemType.FILE) {
					var markers = projectItem.getMarkers();
					if (markers) {
						var numMarkers			= markers.numMarkers;
						var newMarker			= markers.createMarker(12.345);
						var guid 				= newMarker.guid;
						newMarker.name			= 'Marker created by PProPanel.';
						newMarker.comments		= 'Here are some comments, inserted by PProPanel.';
						newMarker.end			= (newMarker.start.seconds + 5.0);

						//default marker type == comment. To change marker type, call one of these:
						// newMarker.setTypeAsChapter();
						// newMarker.setTypeAsWebLink();
						// newMarker.setTypeAsSegmentation();
						// newMarker.setTypeAsComment();
					}
				} else {
					$._PPP_.updateEventPanel("Can only add markers to footage items.");
				}
			} else {
				$._PPP_.updateEventPanel("Could not find first projectItem.");
			}
		} else {
			$._PPP_.updateEventPanel("Project is empty.");
		}
	},

	modifyProjectMetadata : function () {
		var kPProPrivateProjectMetadataURI	= "http://ns.adobe.com/premierePrivateProjectMetaData/1.0/";
		var nameField						= "Column.Intrinsic.Name";
		var tapeName						= "Column.Intrinsic.TapeName";
		var logNote							= "Column.Intrinsic.LogNote";
		var newField						= "ExampleFieldName";
		var desc							= "Column.PropertyText.Description";

		if (app.isDocumentOpen()) {
			var projectItem = app.project.rootItem.children[0]; // just grabs first projectItem.
			if (projectItem) {
				if (ExternalObject.AdobeXMPScript === undefined) {
					ExternalObject.AdobeXMPScript = new ExternalObject('lib:AdobeXMPScript');
				}
				if (ExternalObject.AdobeXMPScript !== undefined) { // safety-conscious!
					var projectMetadata 			= projectItem.getProjectMetadata();
					var successfullyAdded 			= app.project.addPropertyToProjectMetadataSchema(newField, "ExampleFieldLabel", 2);
					var xmp							= new XMPMeta(projectMetadata);
					var obj							= xmp.dumpObject();
					var foundLogNote				= xmp.doesPropertyExist(kPProPrivateProjectMetadataURI, logNote);
					var oldLogValue 				= "";
					var appendThis 					= "This log note inserted by PProPanel.";
					var appendTextWasActuallyNew 	= false;

					if (foundLogNote) {
						var oldLogNote = xmp.getProperty(kPProPrivateProjectMetadataURI, logNote);
						if (oldLogNote) {
							oldLogValue = oldLogNote.value;
						}
					}
					xmp.setProperty(kPProPrivateProjectMetadataURI, tapeName, 	"***TAPENAME***");
					xmp.setProperty(kPProPrivateProjectMetadataURI, desc, 		"***DESCRIPTION***");
					xmp.setProperty(kPProPrivateProjectMetadataURI, nameField, 	"***NEWNAME***");
					xmp.setProperty(kPProPrivateProjectMetadataURI, newField, 	"PProPanel set this, using addPropertyToProjectMetadataSchema().");

					var array 	= [];
					array[0] 	= tapeName;
					array[1] 	= desc;
					array[2] 	= nameField;
					array[3] 	= newField;

					var concatenatedLogNotes = "";

					if (oldLogValue != appendThis) { // if that value is not exactly what we were going to add
						if (oldLogValue.length > 0) { // if we have a valid value
							concatenatedLogNotes += "Previous log notes: " + oldLogValue + "    ||||    ";
						}
						concatenatedLogNotes += appendThis;
						xmp.setProperty(kPProPrivateProjectMetadataURI, logNote, concatenatedLogNotes);
						array[4] = logNote;
					}
					var str = xmp.serialize();
					projectItem.setProjectMetadata(str, array);

					// test: is it in there?

					var newblob = projectItem.getProjectMetadata();
					var newXMP = new XMPMeta(newblob);
					var foundYet = newXMP.doesPropertyExist(kPProPrivateProjectMetadataURI, newField);

					if (foundYet) {
						$._PPP_.updateEventPanel("PProPanel successfully added a field to the project metadata schema, and set a value for it.");
					}
				}
			} else {
				$._PPP_.updateEventPanel("No project items found.");
			}
		}
	},

	updatePAR : function () {
		var item = app.project.rootItem.children[0];
		if (item) {
			if ((item.type == ProjectItemType.FILE) || (item.type == ProjectItemType.CLIP)) {
				// If there is an item, and it's either a clip or file...
				item.setOverridePixelAspectRatio(185, 100); // anamorphic is BACK!	  ;)
			} else {
				$._PPP_.updateEventPanel('You cannot override the PAR of bins or sequences.');
			}
		} else {
			$._PPP_.updateEventPanel("No project items found.");
		}
	},

	getnumAEProjectItems : function () {
		var bt		= new BridgeTalk();
		bt.target	= 'aftereffects';
		bt.body		= 'alert("Items in AE project: " + app.project.rootFolder.numItems);app.quit();';
		bt.send();
	},

	updateEventPanel : function (message) {
		app.setSDKEventMessage(message, 'info');
		/*app.setSDKEventMessage('Here is some information.', 'info');
		app.setSDKEventMessage('Here is a warning.', 'warning');
		app.setSDKEventMessage('Here is an error.', 'error');  // Very annoying; use sparingly.*/
	},

	walkAllBinsDumpingXMP : function (parentItem, outPath) {
		for (var j = 0; j < parentItem.children.numItems; j++) {
			var currentChild = parentItem.children[j];
			if (currentChild) {
				if (currentChild.type === ProjectItemType.BIN) {
					$._PPP_.walkAllBinsDumpingXMP(currentChild, outPath); // warning; recursion!
				} else {
					var isMultiCam		= currentChild.isMulticamClip();
					var isMergedClip	= currentChild.isMergedClip();
					if ((isMergedClip === false) && (isMultiCam === false)) {
						$._PPP_.dumpProjectItemXMP(currentChild, outPath);
					}
				}
			}
		}
	},

	walkAllBinsUpdatingPaths : function (parentItem, outPath) {
		for (var j = 0; j < parentItem.children.numItems; j++) {
			var currentChild = parentItem.children[j];
			if (currentChild) {
				if (currentChild.type === ProjectItemType.BIN) {
					$._PPP_.walkAllBinsUpdatingPaths(currentChild, outPath); // warning; recursion!
				} else {
					$._PPP_.updateProjectItemPath(currentChild, outPath);
				}
			}
		}
	},

	searchBinForProjItemByName : function (i, containingBin, nameToFind) {
		for (var j = i; j < containingBin.children.numItems; j++) {
			var currentChild = containingBin.children[j];
			if (currentChild) {
				if (currentChild.type === ProjectItemType.BIN) {
					return $._PPP_.searchBinForProjItemByName(j, currentChild, nameToFind); // warning; recursion!
				} else {
					if (currentChild.name === nameToFind) {
						return currentChild;
					} else {
						currentChild = currentChild.children[j + 1];
						if (currentChild) {
							return $._PPP_.searchBinForProjItemByName(0, currentChild, nameToFind);
						}
					}
				}
			}
		}
	},

	dumpProjectItemXMP : function (projectItem, outPath) {
		var xmpBlob				= projectItem.getXMPMetadata();
		var outFileName			= projectItem.name + '.xmp';
		var completeOutputPath	= outPath + $._PPP_.getSep() + outFileName;
		var outFile				= new File(completeOutputPath);

		if (outFile) {
			outFile.encoding = "UTF8";
			outFile.open("w", "TEXT", "????");
			outFile.write(xmpBlob.toString());
			outFile.close();
		}
	},

	addSubClip : function () {
		var startTime 			= new Time();
		startTime.seconds		= 0.0;
		var endTime				= new Time();
		endTime.seconds			= 3.21;
		var hasHardBoundaries	= 0;
		var sessionCounter		= 1;
		var takeVideo			= 1; // optional, defaults to 1
		var takeAudio			= 1; //	optional, defaults to 1
		var projectItem 		= app.project.rootItem.children[0]; // just grabs the first item
		if (projectItem) {
			if ((projectItem.type === ProjectItemType.CLIP) || (projectItem.type === ProjectItemType.FILE)) {
				var newSubClipName = prompt('Name of subclip?', projectItem.name + '_' + sessionCounter, 'Name your subclip');
				if (newSubClipName) {
					var newSubClip = projectItem.createSubClip(	newSubClipName,
																startTime,
																endTime,
																hasHardBoundaries,
																takeVideo,
																takeAudio);
					if (newSubClip) {
						var newStartTime		=	new Time();
						newStartTime.seconds	=	12.345;
						newSubClip.setStartTime(newStartTime);
					}
				} else {
					$._PPP_.updateEventPanel("No name provided for sub-clip.");
				}
			} else {
				$._PPP_.updateEventPanel("Could not sub-clip " + projectItem.name + ".");
			}
		} else {
			$._PPP_.updateEventPanel("No project item found.");
		}
	},

	dumpXMPFromAllProjectItems : function () {
		var numItemsInRoot = app.project.rootItem.children.numItems;
		if (numItemsInRoot > 0) {
			var outPath = Folder.selectDialog("Choose the output directory");
			if (outPath) {
				for (var i = 0; i < numItemsInRoot; i++) {
					var currentItem = app.project.rootItem.children[i];
					if (currentItem) {
						if (currentItem.type == ProjectItemType.BIN) {
							$._PPP_.walkAllBinsDumpingXMP(currentItem, outPath.fsName);
						} else {
							$._PPP_.dumpProjectItemXMP(currentItem, outPath.fsName);
						}
					}
				}
			}
		} else {
			$._PPP_.updateEventPanel("No project items found.");
		}
	},

	exportAAF : function () {
		var sessionCounter = 1;
		if (app.project.activeSequence) {
			var outputPath = Folder.selectDialog("Choose the output directory");
			if (outputPath) {
				var absPath		= outputPath.fsName;
				var outputName	= String(app.project.name);
				var array		= outputName.split('.', 2);
				outputName		= array[0] + sessionCounter + '.' + array[1];
				var fullOutPath = absPath + $._PPP_.getSep() + outputName + '.aaf';

				//var optionalPathToOutputPreset = null;  you can specify an output preset.

				app.project.exportAAF(	app.project.activeSequence, // which sequence
										fullOutPath, 	// output path
										1, 				// mix down video?
										0, 				// explode to mono?
										96000, 			// sample rate
										16, 			// bits per sample
										0, 				// embed audio?
										0, 				// audio file format? 0 = aiff, 1 = wav
										0, 				// number of 'handle' frames
										0/*
										optionalPathToOutputPreset*/); // optional; .epr file to use
				sessionCounter++;
			} else {
				$._PPP_.updateEventPanel("Couldn't create AAF output.");
			}
		} else {
			$._PPP_.updateEventPanel("No active sequence.");
		}
	},

	setScratchDisk : function () {
		var scratchPath = Folder.selectDialog("Choose new scratch disk directory");
		if ((scratchPath) && scratchPath.exists) {
			app.setScratchDiskPath(scratchPath.fsName, ScratchDiskType.FirstAutoSaveFolder); // see ScratchDiskType object, in ESTK.
		}
	},

	getProjectProxySetting : function () {
		var returnVal = "";
		if (app.project) {
			returnVal = "No sequence detected in " + app.project.name + ".";
			if (app.getEnableProxies()) {
				returnVal = 'true';
			} else {
				returnVal = 'false';
			}
		} else {
			returnVal = "No project available.";
		}
		return returnVal;
	},

	toggleProxyState : function () {
		var update = "Proxies for " + app.project.name + " turned ";
		if (app.getEnableProxies()) {
			app.setEnableProxies(0);
			update = update + "OFF.";
		} else {
			app.setEnableProxies(1);
			update = update + "ON.";
		}
		$._PPP_.updateEventPanel(update);
	},

	setProxiesON : function () {
		var firstProjectItem = app.project.rootItem.children[0];
		if (firstProjectItem) {
			if (firstProjectItem.canProxy()) {
				var shouldAttachProxy = true;
				var detachProxy = true;
				if (firstProjectItem.hasProxy()) {
					detachProxy = confirm(firstProjectItem.name + " already has an assigned proxy. Detach?", false, "Are you sure...?");
					if (detachProxy) {
						firstProjectItem.detachProxy();
					}
				}
				if (shouldAttachProxy) {
					var filterString = "";
					if (Folder.fs === 'Windows') {
						filterString = "All files:*.*";
					}
					var proxyPath = File.openDialog("Choose proxy for " + firstProjectItem.name + ":",
						filterString,
						false);
					if (proxyPath.exists) {
						firstProjectItem.attachProxy(proxyPath.fsName, 0);
					} else {
						$._PPP_.updateEventPanel("Could not attach proxy from " + proxyPath + ".");
					}
				}
			} else {
				$._PPP_.updateEventPanel("Cannot attach a proxy to " + firstProjectItem.name + ".");
			}
		} else {
			$._PPP_.updateEventPanel("No project item available.");
		}
	},

	clearCache : function () {
		app.enableQE();
		qe.project.deletePreviewFiles(MediaType_ANY);
		$._PPP_.updateEventPanel("All video and audio preview files deleted.");
	},

	randomizeSequenceSelection : function () {
		var sequence = app.project.activeSequence;
		if (sequence) {
			var trackGroups 	= [sequence.audioTracks, sequence.videoTracks];
			var trackGroupNames = ["audioTracks", "videoTracks"];
			var updateUI 		= true;

			for (var groupIndex = 0; groupIndex < 2; groupIndex++) {
				$._PPP_.updateEventPanel(trackGroupNames[groupIndex]);
				var group = trackGroups[groupIndex];
				for (var trackIndex = 0; trackIndex < group.numTracks; trackIndex++) {
					var track			= group[trackIndex];
					var clips			= track.clips;
					var transitions		= track.transitions;
					var beforeSelected;
					var afterSelected;
					var initialSelectState;

					$._PPP_.updateEventPanel("track:" + trackIndex + "	 clip count: " + clips.numItems + "	  transition count: " + transitions.numItems);

					for (var clipIndex = 0; clipIndex < clips.numItems; clipIndex++) {
						var clip = clips[clipIndex];
						var name = (clip.projectItem === undefined ? "<null>":clip.projectItem.name);
						initialSelectState = clip.isSelected();
						var oldOut = clip.outPoint;
						oldOut.seconds = oldOut.seconds - 2.0;
						clip.outPoint.ticks = oldOut.ticks;



						// randomly select clips
						var setIt = (Math.random() > 0.5);
						clip.setSelected((Math.random() > 0.5), updateUI);

						if (clip.isAdjustmentLayer()) {
							$._PPP_.updateEventPanel("Clip named \"" + clip.name + "\" is an adjustment layer.");
						}

						// Note; there's no good place to exercise this code yet, but
						// I wanted to provide example usage.

						var allClipsInThisSequenceFromSameSource = clip.getLinkedItems();

						if (allClipsInThisSequenceFromSameSource) {
							$._PPP_.updateEventPanel("Found " + allClipsInThisSequenceFromSameSource.numItems + " clips from " + clip.projectItem.name + ", in this sequence.");
						}
						beforeSelected	= initialSelectState ? "Y" : "N";
						afterSelected	= clip.isSelected() ? "Y" : "N";
						$._PPP_.updateEventPanel("clip:" + clipIndex + "	 " + name + "		" + beforeSelected + " -> " + afterSelected);
					}

					for (var tni = 0; tni < transitions.numItems; ++tni) {
						var transition 		= transitions[tni];
						var doIt 			= false;
						initialSelectState	= transition.isSelected();
						// randomly select transitions
						if ((Math.random() > 0.5)) {
							doIt = true;
						}
						transition.setSelected(doIt, updateUI);
						beforeSelected	= initialSelectState ? "Y" : "N";
						afterSelected	= transition.isSelected() ? "Y" : "N";
						$._PPP_.updateEventPanel('transition: ' + tni + "		" + beforeSelected + " -> " + afterSelected);
					}
				}
			}
		} else {
			$._PPP_.updateEventPanel("no active sequence.");
		}
	},

	// Define a couple of callback functions, for AME to use during render.

	onEncoderJobComplete : function (jobID, outputFilePath) {
		$._PPP_.updateEventPanel('onEncoderJobComplete called. jobID = ' + jobID + '.');
	},

	onEncoderJobError : function (jobID, errorMessage) {
		var eoName = "";
		if (Folder.fs === 'Macintosh') {
			eoName = "PlugPlugExternalObject";
		} else {
			eoName = "PlugPlugExternalObject.dll";
		}
		var plugplugLibrary = new ExternalObject( "lib:" + eoName );
		if (plugplugLibrary){
			var eventObj	= new CSXSEvent();
			eventObj.type	= "com.adobe.csxs.events.PProPanelRenderEvent";
			eventObj.data	= "Job " + jobID + " failed, due to " + errorMessage + ".";
			eventObj.dispatch();
		}
	},

	onEncoderJobProgress : function (jobID, progress) {
		$._PPP_.updateEventPanel('onEncoderJobProgress called. jobID = ' + jobID + '. progress = ' + progress + '.');
	},

	onEncoderJobQueued : function (jobID) {
		var eoName = "";
		if (Folder.fs === 'Macintosh') {
			eoName = "PlugPlugExternalObject";
		} else {
			eoName = "PlugPlugExternalObject.dll";
		}		
		var plugplugLibrary = new ExternalObject( "lib:" + eoName );
		if (plugplugLibrary){
			var eventObj	= new CSXSEvent();
			eventObj.type	= "com.adobe.csxs.events.PProPanelRenderEvent";
			eventObj.data	= "Job " + jobID + " queued.";
			eventObj.dispatch();
			$._PPP_.updateEventPanel('jobID ' + jobID + 'successfully queued.');
			app.encoder.startBatch();
		}
	},

	onEncoderJobCanceled : function (jobID) {
		var eoName = "";
		if (Folder.fs === 'Macintosh') {
			eoName = "PlugPlugExternalObject";
		} else {
			eoName = "PlugPlugExternalObject.dll";
		}
		var plugplugLibrary = new ExternalObject( "lib:" + eoName );
		if (plugplugLibrary){
			var eventObj	= new CSXSEvent();
			eventObj.type	= "com.adobe.csxs.events.PProPanelRenderEvent";
			eventObj.data	= "Job " + jobID + " canceled.";
			eventObj.dispatch();
			$._PPP_.updateEventPanel('OnEncoderJobCanceled called. jobID = ' + jobID + '.');
		}
	},

	

	onPlayWithKeyframes : function () {
		var seq = app.project.activeSequence;
		if (seq) {
			var firstVideoTrack = seq.videoTracks[0];
			if (firstVideoTrack) {
				var firstClip = firstVideoTrack.clips[0];
				if (firstClip) {
					var clipComponents = firstClip.components;
					if (clipComponents) {
						for (var i = 0; i < clipComponents.numItems; ++i) {
							$._PPP_.updateEventPanel('component ' + i + ' = ' + clipComponents[i].matchName + ' : ' + clipComponents[i].displayName);
						}
						if (clipComponents.numItems > 2) {

							// 0 = clip
							// 1 = Opacity
							// N effects, then...

							var updateUI	= true;
							var blur		= clipComponents[2]; // Assume Gaussian Blur is the first effect applied to the clip.
							if (blur) {
								var blurProps = blur.properties;
								if (blurProps) {
									for (var j = 0; j < blurProps.numItems; ++j) {
										$._PPP_.updateEventPanel('param ' + j + ' = ' + blurProps[j].displayName);
									}
									var blurriness = blurProps[0];

									/* Sample code showing how to get and set the values of a color parameter.

									var colorToChange = change_colorProps[N]; // where 'N' is the index of the effect with a color param.

									var colorVal = colorToChange.getColorValue();

									var alpha = colorVal[0];
									var red   = colorVal[1];
									var blue  = colorVal[2];
									var green = colorVal[3];

                                  	colorToChange.setColorValue(255, 33, 222, 111); // a, r, g, b

									*/

									if (blurriness) {
										if (!blurriness.isTimeVarying()) {
											blurriness.setTimeVarying(true);
										}
										var allKeys = blurriness.getKeys();
										if (allKeys.length) {
											for (var k = 0; k < allKeys.length; ++k) {
												var thisKey = allKeys[k];
												if (thisKey){
													blurriness.setInterpolationTypeAtKey(thisKey, 4, true);
												}
											}
											
											/*blurriness.addKey(k);
											var blurVal	= Math.sin(3.14159 * i / 5) * 20 + 25;
											blurriness.setValueAtKey(k, blurVal, true);
											var time			= app.project.activeSequence.getPlayerPosition();
											var interpType = 5;
											blurriness.setInterpolationTypeAtKey(time, interpType, true);*/
										}
										var safety = blurriness.getKeys();
									}

									var repeatEdgePixels = blurProps[2];
									if (repeatEdgePixels) {
										if (!repeatEdgePixels.getValue()) {
											repeatEdgePixels.setValue(true, updateUI);
										}
									}

									// look for keyframe nearest to 4s with 1/10 second tolerance

									var keyFrameTime = blurriness.findNearestKey(4.0, 0.1);
									if (keyFrameTime !== undefined) {
										$._PPP_.updateEventPanel('Found keyframe = ' + keyFrameTime.seconds);
									} else {
										$._PPP_.updateEventPanel('Keyframe not found.');
									}

									// scan keyframes, forward

									keyFrameTime = blurriness.findNearestKey(0.0, 0.1);
									var lastKeyFrameTime = keyFrameTime;
									while (keyFrameTime !== undefined) {
										$._PPP_.updateEventPanel('keyframe @ ' + keyFrameTime.seconds);
										lastKeyFrameTime	= keyFrameTime;
										keyFrameTime 		= blurriness.findNextKey(keyFrameTime);
									}

									// scan keyframes, backward
									keyFrameTime = lastKeyFrameTime;
									while (keyFrameTime !== undefined) {
										$._PPP_.updateEventPanel('keyframe @ ' + keyFrameTime.seconds);
										lastKeyFrameTime	= keyFrameTime;
										keyFrameTime		= blurriness.findPreviousKey(keyFrameTime);
									}

									var blurKeyframesArray = blurriness.getKeys(); // get all keyframes
									if (blurKeyframesArray) {
										$._PPP_.updateEventPanel(blurKeyframesArray.length + ' keyframes found');
									}

									blurriness.removeKey(19); // remove keyframe at 19s

									blurriness.removeKeyRange(0, 5, updateUI); // remove keyframes in range from 0s to 5s
								}
							} else {
								$._PPP_.updateEventPanel("To make this sample code work, please apply the Gaussian Blur effect to the first clip in the first video track of the active sequence.");
							}
						}
					}
				}
			}
		} else {
			$._PPP_.updateEventPanel("no active sequence.");
		}
	},

	extractFileNameFromPath : function (fullPath) {
		var lastDot = fullPath.lastIndexOf(".");
		var lastSep = fullPath.lastIndexOf("/");
		if (lastDot > -1) {
			return fullPath.substr((lastSep + 1), (fullPath.length - (lastDot + 1)));
		} else {
			return fullPath;
		}
	},

	onProxyTranscodeJobComplete : function (jobID, outputFilePath) {
		var suffixAddedByPPro	= '_1'; // You should really test for any suffix.
		var withoutExtension	= outputFilePath.slice(0, -4); // trusting 3 char extension
		var lastIndex			= outputFilePath.lastIndexOf(".");
		var extension			= outputFilePath.substr(lastIndex + 1);
		var wrapper				= [];
		wrapper[0] 				= outputFilePath;
		var nameToFind			= 'Proxies generated by PProPanel';
		var targetBin 			= $._PPP_.getPPPInsertionBin();
		if (targetBin) {
			app.project.importFiles(wrapper, true, null, false);
		}
	},

	onProxyTranscodeJobError : function (jobID, errorMessage) {
		$._PPP_.updateEventPanel(errorMessage);
	},

	onProxyTranscodeJobQueued : function (jobID) {
		app.encoder.startBatch();
	},

	ingestFiles : function (outputPresetPath) {
		app.encoder.bind('onEncoderJobComplete',	$._PPP_.onProxyTranscodeJobComplete);
		app.encoder.bind('onEncoderJobError',		$._PPP_.onProxyTranscodeJobError);
		app.encoder.bind('onEncoderJobQueued',		$._PPP_.onProxyTranscodeJobQueued);
		app.encoder.bind('onEncoderJobCanceled',	$._PPP_.onEncoderJobCanceled);

		if (app.project) {
			var filterString = "";
			if (Folder.fs === 'Windows') {
				filterString = "All files:*.*";
			}
			var fileOrFilesToImport = File.openDialog(	"Choose full resolution files to import", 	// title
														filterString, 								// filter available files?
														true); 										// allow multiple fiels to be selected?
			if (fileOrFilesToImport) {
				var nameToFind = 'Proxies generated by PProPanel';
				var targetBin = $._PPP_.searchForBinWithName(nameToFind);
				if (targetBin === 0) {
					// If panel can't find the target bin, it creates it.
					app.project.rootItem.createBin(nameToFind);
					targetBin = $._PPP_.searchForBinWithName(nameToFind);
				}
				if (targetBin) {
					targetBin.select();
					var importThese = []; // We have an array of File objects; importFiles() takes an array of paths.
					if (importThese) {
						for (var i = 0; i < fileOrFilesToImport.length; i++) {
							var removeUponCompletion 	= 0;
							importThese[i] 				= fileOrFilesToImport[i].fsName;
							var justFileName 			= $._PPP_.extractFileNameFromPath(importThese[i]);
							var suffix 					= '_PROXY.mp4';
							var containingPath 			= fileOrFilesToImport[i].parent.fsName;
							var completeProxyPath 		= containingPath + $._PPP_.getSep() + justFileName + suffix;

							var jobID = app.encoder.encodeFile(	fileOrFilesToImport[i].fsName,
																completeProxyPath,
																outputPresetPath,
																removeUponCompletion);
						}

						app.project.importFiles(importThese,	// array of file paths to be imported
												true, 			// suppress warnings
												targetBin,		// destination bin
												false); 		// import as numbered stills
					}
				} else {
					$._PPP_.updateEventPanel("Could not find or create target bin.");
				}
			} else {
				$._PPP_.updateEventPanel("No files to import.");
			}
		} else {
			$._PPP_.updateEventPanel("No project found.");
		}
	},

	insertOrAppend : function () {
		var seq = app.project.activeSequence;
		if (seq) {
			var first = app.project.rootItem.children[0];
			if (first) {
				if (!first.isSequence()) {
					if (first.type !== ProjectItemType.BIN) {
						var numVTracks = seq.videoTracks.numTracks;
						var targetVTrack = seq.videoTracks[(numVTracks - 1)];
						if (targetVTrack) {
							// If there are already clips in this track, append this one to the end. Otherwise, insert at start time.
							if (targetVTrack.clips.numItems > 0) {
								var lastClip = targetVTrack.clips[(targetVTrack.clips.numItems - 1)];
								if (lastClip) {
									targetVTrack.insertClip(first, lastClip.end.seconds);
								}
							} else {
								var timeAtZero = new Time();
								targetVTrack.insertClip(first, timeAtZero.seconds);
								// Using linkSelection/unlinkSelection calls, panels can remove just the audio (or video) of a given clip.
								var newlyAddedClip = targetVTrack.clips[(targetVTrack.clips.numItems - 1)];
								if (newlyAddedClip) {
									newlyAddedClip.setSelected(true, true);
									seq.unlinkSelection();
									newlyAddedClip.remove(true, true);
									seq.linkSelection();
								} else {
									$._PPP_.updateEventPanel("Could not add clip.");
								}
							}
						} else {
							$._PPP_.updateEventPanel("Could not find first video track.");
						}
					} else {
						$._PPP_.updateEventPanel(first.name + " is a bin.");
					}
				} else {
					$._PPP_.updateEventPanel(first.name + " is a sequence.");
				}
			} else {
				$._PPP_.updateEventPanel("Couldn't locate first projectItem.");
			}
		} else {
			$._PPP_.updateEventPanel("no active sequence.");
		}
	},

	overWrite : function () {
		var seq = app.project.activeSequence;
		if (seq) {
			var first = app.project.rootItem.children[0];
			if (first) {
				var vTrack1 = seq.videoTracks[0];
				if (vTrack1) {
					var now = seq.getPlayerPosition();
					vTrack1.overwriteClip(first, now.seconds);
				} else {
					$._PPP_.updateEventPanel("Could not find first video track.");
				}
			} else {
				$._PPP_.updateEventPanel("Couldn't locate first projectItem.");
			}
		} else {
			$._PPP_.updateEventPanel("no active sequence.");
		}
	},

	closeFrontSourceClip : function () {
		app.sourceMonitor.closeClip();
	},

	closeAllClipsInSourceMonitor : function () {
		app.sourceMonitor.closeAllClips();
	},

	changeLabel : function () {
		var first = app.project.rootItem.children[0];
		if (first) {
			var currentLabel 	= first.getColorLabel();
			var newLabel 		= currentLabel + 1; // 4 = Cerulean. 0 = Violet, 15 = Yellow.
			if (newLabel > 15) {
				newLabel = newLabel - 16;
			}
			$._PPP_.updateEventPanel("Previous Label color = " + currentLabel + ".");
			first.setColorLabel(newLabel);
			$._PPP_.updateEventPanel("New Label color = " + newLabel + ".");
		} else {
			$._PPP_.updateEventPanel("Couldn't locate first projectItem.");
		}
	},

	getPPPInsertionBin : function () {
		var nameToFind	= "Here's where PProPanel puts things.";
		var targetBin	= $._PPP_.searchForBinWithName(nameToFind);

		if (targetBin === undefined) {
			// If panel can't find the target bin, it creates it.
			app.project.rootItem.createBin(nameToFind);
			targetBin = $._PPP_.searchForBinWithName(nameToFind);
		}
		if (targetBin) {
			targetBin.select();
			return targetBin;
		} else {
			$._PPP_.updateEventPanel("Couldn't find or create a target bin.");
		}
	},

	importComps : function () {
		var targetBin = $._PPP_.getPPPInsertionBin();
		if (targetBin) {
			var filterString = "";
			if (Folder.fs === 'Windows') {
				filterString = "All files:*.*";
			}
			var compNamesToImport	= [];
			var aepToImport			= File.openDialog(	"Choose After Effects project", // title
														filterString, 					// filter available files?
														false); 						// allow multiple?
			if (aepToImport) {
				var importAll = confirm("Import all compositions in project?", false, "Import all?");
				if (importAll) {
					var result = app.project.importAllAEComps(aepToImport.fsName, targetBin);
				} else {
					var compName = prompt('Name of composition to import?', '', 'Which Comp to import');
					if (compName) {
						compNamesToImport[0] 	= compName;
						var importAECompResult 	= app.project.importAEComps(aepToImport.fsName, compNamesToImport, targetBin);
					} else {
						$._PPP_.updateEventPanel("No composition specified.");
					}
				}
			} else {
				$._PPP_.updateEventPanel("Could not open project.");
			}
		} else {
			$._PPP_.updateEventPanel("Could not find or create target bin.");
		}
	},

	consolidateProject : function () {
		var pmo = app.projectManager.options;

		if (app.project.sequences.numSequences) {
			if (pmo) {
				var filterString = "";
				if (Folder.fs === 'Windows') {
					filterString = "Output Presets:*.epr";
				}
				var outFolder = Folder.selectDialog("Choose output directory.");
				if (outFolder) {
					var presetPath = "";
					var useSpecificPreset = confirm("Would you like to select an output preset?", false, "Are you sure...?");
					if (useSpecificPreset) {
						var useThisEPR = File.openDialog(	"Choose output preset (.epr file)", // title
															filterString, 						// filter available files?
															false); 							// allow multiple?
						if (useThisEPR) {
							pmo.clipTranscoderOption	= pmo.CLIP_TRANSCODE_MATCH_PRESET;
							pmo.encoderPresetFilePath	= useThisEPR.fsName;
						} else {
							$._PPP_.updateEventPanel("Couldn't find specified .epr file.");
						}
					} else {
						pmo.clipTranscoderOption = pmo.CLIP_TRANSCODE_MATCH_SEQUENCE;
					}
					var processAllSequences = confirm("Process all sequences? No = just the first sequence found.", true, "Process all?");
					if (processAllSequences) {
						pmo.includeAllSequences = true;
					} else {
						pmo.includeAllSequences	= false;
						pmo.affectedSequences	= [app.project.sequences[0]];
					}

					pmo.clipTransferOption 			= pmo.CLIP_TRANSFER_TRANSCODE;
					pmo.convertAECompsToClips 		= false;
					pmo.convertSyntheticsToClips 	= false;
					pmo.copyToPreventAlphaLoss 		= false;
					pmo.destinationPath 			= outFolder.fsName;
					pmo.excludeUnused 				= false;
					pmo.handleFrameCount 			= 0;
					pmo.includeConformedAudio 		= true;
					pmo.includePreviews 			= true;
					pmo.renameMedia 				= false;

					var result		= app.projectManager.process(app.project);
					var errorList	= app.projectManager.errors;

					if (errorList.length) {
						for (var k = 0; k < errorList.length; k++) {
							$._PPP_.updateEventPanel(errorList[k][0]);
						}
					} else {
						$._PPP_.updateEventPanel(app.project.name + " successfully processed to " + outFolder.fsName + ".");
					}
					return result;
				}
			} else {
				$._PPP_.updateEventPanel("Could not get Project Manager options.");
			}
		} else {
			$._PPP_.updateEventPanel("No sequences available.");
		}
	},

	importMoGRT : function () {
		var activeSeq = app.project.activeSequence;
		if (activeSeq) {
			var filterString = "";
			if (Folder.fs === 'Windows') {
				filterString = "Motion Graphics Templates:*.mogrt";
			}
			var mogrtToImport = File.openDialog("Choose MoGRT",	// title
												filterString,	// filter available files?
												false);			// allow multiple?
			if (mogrtToImport) {
				var targetTime 		= activeSeq.getPlayerPosition();
				var vidTrackOffset 	= 0;
				var audTrackOffset 	= 0;
				var newTrackItem 	= activeSeq.importMGT(	mogrtToImport.fsName,
															targetTime.ticks,
															vidTrackOffset,
															audTrackOffset);
				if (newTrackItem) {
					var moComp = newTrackItem.getMGTComponent();
					if (moComp) {
						var params = moComp.properties;
						for (var z = 0; z < params.numItems; z++) {
							var thisParam = params[z];
							if (thisParam) {
								$._PPP_.updateEventPanel('Parameter ' + (z + 1) + ' name: ' + thisParam.name + '.');
							}
						}
						var srcTextParam = params.getParamForDisplayName("Source Text");
						if (srcTextParam) {
							var val = srcTextParam.getValue();
							srcTextParam.setValue("New value set by PProPanel!");
						}
					}
				}
			} else {
				$._PPP_.updateEventPanel('Unable to import specified .mogrt file.');
			}
		} else {
			$._PPP_.updateEventPanel('No active sequence.');
		}
	},

	reportCurrentProjectSelection : function () {
		var viewIDs 		= app.getProjectViewIDs();
		var viewSelection 	= app.getProjectViewSelection(viewIDs[0]); // sample code optimized for a single open project
		$._PPP_.projectPanelSelectionChanged(viewSelection, viewIDs[0]);
	},

	randomizeProjectSelection : function () {
		var viewIDs						= app.getProjectViewIDs();
		var firstProject				= app.getProjectFromViewID(viewIDs[0]);
		var arrayOfRandomProjectItems	= [];

		for (var b = 0; b < app.project.rootItem.children.numItems; b++) {
			var currentProjectItem = app.project.rootItem.children[b];
			if (Math.random() > 0.5) {
				arrayOfRandomProjectItems.push(currentProjectItem);
			}
		}
		if (arrayOfRandomProjectItems.length > 0) {
			app.setProjectViewSelection(arrayOfRandomProjectItems, viewIDs[0]);
		}
	},

	setAllProjectItemsOnline : function (startingBin) {
		for (var k = 0; k < startingBin.children.numItems; k++) {
			var currentChild = startingBin.children[k];
			if (currentChild) {
				if (currentChild.type === ProjectItemType.BIN) {
					$._PPP_.setAllProjectItemsOnline(currentChild); // warning; recursion!
				} else if (currentChild.isOffline()) {
					currentChild.changeMediaPath(currentChild.getMediaPath(), true);
					if (currentChild.isOffline()) {
						$._PPP_.updateEventPanel("Failed to bring \'" + currentChild.name + "\' online.");
					} else {
						$._PPP_.updateEventPanel("\'" + currentChild.name + "\' is once again online.");
					}
				}
			}
		}
	},

	setAllOnline : function () {
		var startingBin = app.project.rootItem;
		$._PPP_.setAllProjectItemsOnline(startingBin);
	},

	setOffline : function () {
		var viewIDs = app.getProjectViewIDs();
		for (var a = 0; a < app.projects.numProjects; a++) {
			var currentProject = app.getProjectFromViewID(viewIDs[a]);
			if (currentProject) {
				if (currentProject.documentID === app.project.documentID) { // We're in the right project!
					var selectedItems = app.getProjectViewSelection(viewIDs[a]);
					if (selectedItems && selectedItems.length > 0) {
						for (var b = 0; b < selectedItems.length; b++) {
							var currentItem = selectedItems[b];
							if (currentItem) {
								if ((!currentItem.isSequence()) && (currentItem.type !== ProjectItemType.BIN)) { // For every selected item which isn't a bin or sequence...
									if (currentItem.isOffline()) {
										$._PPP_.updateEventPanel("\'" + currentItem.name + "\'was already offline.");
									} else {
										var result = currentItem.setOffline();
										$._PPP_.updateEventPanel("\'" + currentItem.name + "\' is now offline.");
									}
								}
							}
						}
					}
				}
			}
		}
	},

	updateFrameRate : function () {
		var item = app.project.rootItem.children[0];
		if (item) {
			if ((item.type == ProjectItemType.FILE) || (item.type == ProjectItemType.CLIP)) {
				// If there is an item, and it's either a clip or file...
				item.setOverrideFrameRate(23.976);
			} else {
				$._PPP_.updateEventPanel('You cannot override the frame rate of bins or sequences.');
			}
		} else {
			$._PPP_.updateEventPanel("No project items found.");
		}
	},

	onItemAddedToProject : function (whichProject, addedProjectItem) {
		var msg = addedProjectItem.name + " was added to " + whichProject + ".";
		$._PPP_.updateEventPanel(msg);
	},

	registerItemAddedFxn : function () {
		app.onItemAddedToProjectSuccess = $._PPP_.onItemAddedToProject;
	},

	myOnProjectChanged : function (documentID) {
		var msg = 'Project with ID ' + documentID + ' changed, in some way.';
		$._PPP_.updateEventPanel(msg);
	},

	registerProjectChangedFxn : function () {
		app.bind('onProjectChanged', $._PPP_.myOnProjectChanged);
	},

	confirmPProHostVersion : function () {
		var version = parseFloat(app.version);
		if (version < 14.0) {
			$._PPP_.updateEventPanel("Note: PProPanel relies on features added in 14.0, but is currently running in " + version + ".");
		}
	},

	changeMarkerColors : function () {
		if (app.project.rootItem.children.numItems > 0) {
			var projectItem = app.project.rootItem.children[0]; // assumes first item is footage.
			if (projectItem) {
				if (projectItem.type == ProjectItemType.CLIP ||	projectItem.type == ProjectItemType.FILE) {
					var markers = projectItem.getMarkers();
					if (markers) {
						var markerCount = markers.numMarkers;
						if (markerCount) {
							for (var thisMarker = markers.getFirstMarker(); thisMarker !== undefined; thisMarker = markers.getNextMarker(thisMarker)) {
								var oldColor = thisMarker.getColorByIndex();
								var newColor = oldColor + 1;
								if (newColor > 7) {		// clamp to valid values
									newColor = 0;
								}
								thisMarker.setColorByIndex(newColor);
								$._PPP_.updateEventPanel("Changed color of marker named \'" + thisMarker.name + "\' from " + oldColor + " to " + newColor + ".");
							}
						}
					}
				} else {
					$._PPP_.updateEventPanel("Can only add markers to footage items.");
				}
			} else {
				$._PPP_.updateEventPanel("Could not find first projectItem.");
			}
		} else {
			$._PPP_.updateEventPanel("Project is empty.");
		}
	},

	changeSeqTimeCodeDisplay : function () {
		var seq = app.project.activeSequence;
		if (seq) {
			var currentSeqSettings	= app.project.activeSequence.getSettings();
			if (currentSeqSettings) {
				var oldVidSetting	= currentSeqSettings.videoDisplayFormat;
				var timeAsText		= seq.getPlayerPosition().getFormatted(currentSeqSettings.videoFrameRate, app.project.activeSequence.videoDisplayFormat);

				currentSeqSettings.videoDisplayFormat = oldVidSetting + 1;
				if (currentSeqSettings.videoDisplayFormat > TIMEDISPLAY_48Timecode) {	// clamp to valid values
					currentSeqSettings.videoDisplayFormat = TIMEDISPLAY_24Timecode;
				}
				app.project.activeSequence.setSettings(currentSeqSettings);
				$._PPP_.updateEventPanel("Changed timecode display format for \'" + app.project.activeSequence.name + "\'.");
			}
		} else {
			$._PPP_.updateEventPanel("No active sequence.");
		}
	},

	myActiveSequenceChangedFxn : function () {
		$._PPP_.updateEventPanel(app.project.activeSequence.name + " changed, in some way.");
	},

	mySequenceActivatedFxn : function () {
		$._PPP_.updateEventPanel("Active sequence is now " + app.project.activeSequence.name + ", in Project " + app.project.name + ".");
	},

	myActiveSequenceSelectionChangedFxn : function () {
		var seq = app.project.activeSequence;
		if (seq) {
			var sel = seq.getSelection();
			if (sel) {
				$._PPP_.updateEventPanel(sel.length + ' track items selected in ' + app.project.activeSequence.name + '.');
				for (var i = 0; i < sel.length; i++) {
					if (sel[i].name !== 'anonymous') {
						$._PPP_.updateEventPanel('Selected item ' + (i + 1) + ' == ' + sel[i].name + '.');
					}
				}
			} else {
				$._PPP_.updateEventPanel('No clips selected.');
			}
		} else {
			$._PPP_.updateEventPanel('No active sequence.');
		}
	},

	myActiveSequenceStructureChangedFxn : function () {
		$._PPP_.updateEventPanel('Something in  ' + app.project.activeSequence.name + 'changed.');
	},

	registerActiveSequenceStructureChangedFxn : function () {
		var success	=	app.bind("onActiveSequenceStructureChanged", $._PPP_.myActiveSequenceStructureChangedFxn);
	},

	registerActiveSequenceChangedFxn : function () {
		var success	=	app.bind("onActiveSequenceChanged", $._PPP_.myActiveSequenceChangedFxn);
	},

	registerSequenceSelectionChangedFxn : function () {
		var success = app.bind('onActiveSequenceSelectionChanged', $._PPP_.myActiveSequenceSelectionChangedFxn);
	},

	registerSequenceActivatedFxn : function () {
		var success = app.bind('onSequenceActivated', $._PPP_.mySequenceActivatedFxn);
	},

	forceLogfilesOn : function () {
		app.enableQE();
		var previousLogFilesValue = qe.getDebugDatabaseEntry("CreateLogFilesThatDoNotExist");

		if (previousLogFilesValue === 'true') {
			$._PPP_.updateEventPanel("Force create Log files was already ON.");
		} else {
			qe.setDebugDatabaseEntry("CreateLogFilesThatDoNotExist", "true");
			$._PPP_.updateEventPanel("Set Force create Log files to ON.");
		}
	},

	insertOrAppendToTopTracks : function () {
		var seq = app.project.activeSequence;
		if (seq) {
			var first = app.project.rootItem.children[0];
			if (first) {
				var time	= seq.getPlayerPosition();
				var newClip = seq.insertClip(first, time, (seq.videoTracks.numTracks - 1), (seq.audioTracks.numTracks - 1));
				if (newClip) {
					$._PPP_.updateEventPanel("Inserted " + newClip.name + ", into " + seq.name + ".");
				}
			} else {
				$._PPP_.updateEventPanel("Couldn't locate first projectItem.");
			}
		} else {
			$._PPP_.updateEventPanel("no active sequence.");
		}
	},

	closeAllProjectsOtherThanActiveProject : function () {
		var viewIDs				= app.getProjectViewIDs();
		var closeTheseProjects	= [];
		for (var a = 0; a < viewIDs.length; a++) {
			var thisProj = app.getProjectFromViewID(viewIDs[a]);
			if (thisProj.documentID !== app.project.documentID) {
				closeTheseProjects[a] = thisProj;
			}
		}
		// Why do this afterward? Because if we close projects in that loop [above], we change the active project, and scare the user. :)
		for (var b = 0; b < closeTheseProjects.length; b++) {
			$._PPP_.updateEventPanel("Closed " + closeTheseProjects[b].name);
			closeTheseProjects[b].closeDocument();
		}
	},

	countAdjustmentLayersInBin : function (parentItem, arrayOfAdjustmentLayerNames, foundSoFar) {
		for (var j = 0; j < parentItem.children.numItems; j++) {
			var currentChild = parentItem.children[j];
			if (currentChild) {
				if (currentChild.type == ProjectItemType.BIN) {
					$._PPP_.countAdjustmentLayersInBin(currentChild, arrayOfAdjustmentLayerNames, foundSoFar); // warning; recursion!
				} else {
					if (currentChild.isAdjustmentLayer()) {
						arrayOfAdjustmentLayerNames[foundSoFar] = currentChild.name;
						foundSoFar++;
					}
				}
			}
		}
		$._PPP_.updateEventPanel(foundSoFar + " adjustment layers found in " + app.project.name + ".");
	},

	findAllAdjustmentLayersInProject : function () {
		var arrayOfAdjustmentLayerNames	= [];
		var foundSoFar					= 0;
		var startingBin					= app.project.rootItem;

		$._PPP_.countAdjustmentLayersInBin(startingBin, arrayOfAdjustmentLayerNames, foundSoFar);

		if (arrayOfAdjustmentLayerNames.length) {
			var remainingArgs	= arrayOfAdjustmentLayerNames.length;
			var message			= remainingArgs + " adjustment layers found: ";

			for (var i = 0; i < arrayOfAdjustmentLayerNames.length; i++) {
				message += arrayOfAdjustmentLayerNames[i];
				remainingArgs--;
				if (remainingArgs > 1) {
					message += ', ';
				}
				if (remainingArgs === 1) {
					message += ", and ";
				}
				if (remainingArgs === 0) {
					message += ".";
				}
			}
			$._PPP_.updateEventPanel(message);
		} else {
			$._PPP_.updateEventPanel("No adjustment layers found in " + app.project.name + ".");
		}
	},

	consolidateDuplicates : function () {
		var result = app.project.consolidateDuplicates();
		$._PPP_.updateEventPanel("Duplicates consolidated in " + app.project.name + ".");
	},

	closeAllSequences : function () {
		var seqList = app.project.sequences;
		if (seqList.numSequences) {
			for (var a = 0; a < seqList.numSequences; a++) {
				var currentSeq = seqList[a];
				if (currentSeq) {
					currentSeq.close();
				} else {
					$._PPP_.updateEventPanel("No sequences from " + app.project.name + " were open.");
				}
			}
		} else {
			$._PPP_.updateEventPanel("No sequences found in " + app.project.name + ".");
		}
	},

	dumpAllPresets : function () {
		var desktopPath		= new File("~/Desktop");
		var outputFileName	= desktopPath.fsName + $._PPP_.getSep() + 'available_presets.txt';
		var exporters		= app.encoder.getExporters();
		var outFile			= new File(outputFileName);
		outFile.encoding	= "UTF8";

		outFile.open("w", "TEXT", "????");

		for (var i = 0; i < exporters.length; i++) {
			var exporter = exporters[i];
			if (exporter) {
				outFile.writeln('-----------------------------------------------');
				outFile.writeln(i + ': ' + exporter.name + ' : ' + exporter.classID + ' : ' + exporter.fileType);
				var presets = exporter.getPresets();
				if (presets) {
					outFile.writeln(presets.length + ' presets found.');
					outFile.writeln('+++++++++');
					outFile.writeln('+++++++++');
					for (var j = 0; j < presets.length; j++) {
						var preset = presets[j];
						if (preset) {
							outFile.writeln('matchName: ' + preset.matchName + '(' + preset.name + ')');
							outFile.writeln('+++++++++');
						}
					}
				}
			}
		}
		$._PPP_.updateEventPanel("List of available presets saved to desktop as \'available_presets.txt\'.");
		desktopPath.close();
		outFile.close();
	},

	reportSequenceVRSettings : function () {
		var seq = app.project.activeSequence;
		if (seq) {
			var settings = seq.getSettings();
			if (settings) {
				$._PPP_.updateEventPanel("====================================================");
				$._PPP_.updateEventPanel("VR Settings for \'" + seq.name + "\':");
				$._PPP_.updateEventPanel("");
				$._PPP_.updateEventPanel("");
				$._PPP_.updateEventPanel("	Horizontal captured view: "	+ settings.vrHorzCapturedView);
				$._PPP_.updateEventPanel("	Vertical captured view: "	+ settings.vrVertCapturedView);
				$._PPP_.updateEventPanel("	Layout: "					+ settings.vrLayout);
				$._PPP_.updateEventPanel("	Projection: "				+ settings.vrProjection);
				$._PPP_.updateEventPanel("");
				$._PPP_.updateEventPanel("");
				$._PPP_.updateEventPanel("====================================================");
			}
		} else {
			$._PPP_.updateEventPanel("No active sequence.");
		}
	},

	openProjectItemInSource : function () {
		var viewIDs = app.getProjectViewIDs();
		if (viewIDs) {
			for (var a = 0; a < app.projects.numProjects; a++) {
				var currentProject = app.getProjectFromViewID(viewIDs[a]);
				if (currentProject) {
					if (currentProject.documentID === app.project.documentID) { // We're in the right project!
						var selectedItems = app.getProjectViewSelection(viewIDs[a]);
						if (selectedItems) {
							for (var b = 0; b < selectedItems.length; b++) {
								var currentItem = selectedItems[b];
								if (currentItem) {
									if (currentItem.type !== ProjectItemType.BIN) { // For every selected item which isn't a bin or sequence...
										app.sourceMonitor.openProjectItem(currentItem);
									}
								} else {
									$._PPP_.updateEventPanel("No item available.");
								}
							}
						}
					}
				} else {
					$._PPP_.updateEventPanel("No project available.");
				}
			}
		} else {
			$._PPP_.updateEventPanel("No view IDs available.");
		}
	},

	reinterpretFootage : function () {
		var viewIDs = app.getProjectViewIDs();
		if (viewIDs) {
			for (var a = 0; a < app.projects.numProjects; a++) {
				var currentProject = app.getProjectFromViewID(viewIDs[a]);
				if (currentProject) {
					if (currentProject.documentID === app.project.documentID) { // We're in the right project!
						var selectedItems = app.getProjectViewSelection(viewIDs[a]);
						if (selectedItems.length) {
							for (var b = 0; b < selectedItems.length; b++) {
								var currentItem = selectedItems[b];
								if (currentItem) {
									if ((currentItem.type !== ProjectItemType.BIN) &&
										(currentItem.isSequence() === false)) {
										var interp = currentItem.getFootageInterpretation();
										if (interp) {
											interp.frameRate		= 17.868;
											interp.pixelAspectRatio	= 1.2121;
											currentItem.setFootageInterpretation(interp);
											$._PPP_.updateEventPanel("Changed frame rate and PAR for " + currentItem.name + ".");
										} else {
											$._PPP_.updateEventPanel("Unable to get interpretation for " + currentItem.name + ".");
										}
										var mapping = currentItem.getAudioChannelMapping;
										if (mapping) {
											mapping.audioChannelsType	= AUDIOCHANNELTYPE_Stereo;
											mapping.audioClipsNumber	= 1;
											mapping.setMappingForChannel(0, 4); // 1st param = channel index, 2nd param = source index
											mapping.setMappingForChannel(1, 5);
											currentItem.setAudioChannelMapping(mapping); // submit changed mapping object
											$._PPP_.updateEventPanel("Modified audio channel type and channel mapping for " + currentItem.name + ".");
										}
									}
								} else {
									$._PPP_.updateEventPanel("No project item available.");
								}
							}
						} else {
							$._PPP_.updateEventPanel("No items selected.");
						}
					}
				} else {
					$._PPP_.updateEventPanel("No project available.");
				}
			}
		} else {
			$._PPP_.updateEventPanel("No view IDs available.");
		}
	},

	createSubSequence : function () {

		/* 	Behavioral Note

			createSubSequence() uses track targeting to select clips when there is
			no current clip selection, in the sequence. To create a subsequence with
			clips on tracks that are currently NOT targeted, either select some clips
			(on any track), or temporarily target all desired tracks.

		*/

		var activeSequence = app.project.activeSequence;
		if (activeSequence) {
			var targetTrackFound	= false;
			var cloneAnyway			= true;
			for (var a = 0;	(a < activeSequence.videoTracks.numTracks && targetTrackFound === false); a++) {
				if (activeSequence.videoTracks[a].isTargeted()) {
					targetTrackFound = true;
				}
			}
			// If no targeted track was found, just target the first (zero-th) track, for demo purposes
			if (targetTrackFound === false) {
				activeSequence.videoTracks[0].setTargeted(true, true);
			}
			if ((activeSequence.getInPoint() === NOT_SET) && (activeSequence.getOutPoint() === NOT_SET)) {
				cloneAnyway = confirm("No in or out points set; clone entire sequence?", false, "Clone the whole thing?");
			}
			if (cloneAnyway) {
				var ignoreMapping	= confirm("Ignore track mapping?", false, "Ignore track mapping?");
				var newSeq			= activeSequence.createSubsequence(ignoreMapping);
				newSeq.name 		= newSeq.name + ", cloned by PProPanel.";
			}
		} else {
			$._PPP_.updateEventPanel("No active sequence.");
		}
	},

	selectAllRetimedClips : function () {
		var activeSeq 		= app.project.activeSequence;
		var numRetimedClips = 0;
		if (activeSeq) {
			var trackGroups		= [activeSeq.audioTracks, activeSeq.videoTracks];
			var trackGroupNames = ["audioTracks", "videoTracks"];
			var updateUI 		= true;
			for (var groupIndex = 0; groupIndex < 2; groupIndex++) {
				var group = trackGroups[groupIndex];
				for (var trackIndex = 0; trackIndex < group.numTracks; trackIndex++) {
					var track = group[trackIndex];
					var clips = track.clips;
					for (var clipIndex = 0; clipIndex < clips.numItems; clipIndex++) {
						var clip = clips[clipIndex];
						if (clip.getSpeed() !== 1) {
							clip.setSelected(true, updateUI);
							numRetimedClips++;
						}
					}
				}
			}
			$._PPP_.updateEventPanel(numRetimedClips + " retimed clips found.");
		} else {
			$._PPP_.updateEventPanel("No active sequence.");
		}
	},

	selectReversedClips : function () {
		var sequence			= app.project.activeSequence;
		var numReversedClips	= 0;
		if (sequence) {
			var trackGroups		= [sequence.audioTracks, sequence.videoTracks];
			var trackGroupNames	= ["audioTracks", "videoTracks"];
			var updateUI = true;

			for (var groupIndex = 0; groupIndex < 2; groupIndex++) {
				var group = trackGroups[groupIndex];
				if (group){
					for (var trackIndex = 0; trackIndex < group.numTracks; trackIndex++) {
						for (var clipIndex = 0; clipIndex < group[trackIndex].clips.numItems; clipIndex++) {
							var clip		= group[trackIndex].clips[clipIndex];
							var isReversed	= clip.isSpeedReversed();
							if (isReversed) {
								clip.setSelected(isReversed, updateUI);
								numReversedClips++;
							}
						}
					}
				}
			}
			$._PPP_.updateEventPanel(numReversedClips + " reversed clips found.");
		} else {
			$._PPP_.updateEventPanel("No active sequence.");
		}
	},

	logConsoleOutput : function () {
		app.enableQE();
		var logFileName	= "PPro_Console_output.txt";
		var outFolder	= Folder.selectDialog("Where do you want to save the log file?");
		if (outFolder) {
			var entireOutputPath	= outFolder.fsName + $._PPP_.getSep() + logFileName;
			var result				= qe.executeConsoleCommand("con.openlog " + entireOutputPath);
			$._PPP_.updateEventPanel("Log opened at " + entireOutputPath + ".");
		} else {
			$._PPP_.updateEventPanel("No output folder selected.");
		}
	},

	closeLog : function () {
		app.enableQE();
		qe.executeConsoleCommand("con.closelog");
	},

	stitch : function (presetPath) {
		var viewIDs = app.getProjectViewIDs();
		var allPathsToStitch = "";
		
		for (var a = 0; a < app.projects.numProjects; a++) {
			var currentProject = app.getProjectFromViewID(viewIDs[a]);
			if (currentProject) {
				if (currentProject.documentID === app.project.documentID) { // We're in the right project!
					var selectedItems = app.getProjectViewSelection(viewIDs[a]);
					if (selectedItems.length > 1) {
						for (var b = 0; b < selectedItems.length; b++) {
							var currentItem = selectedItems[b];
							if (currentItem) {
								if ((!currentItem.isSequence()) && (currentItem.type !== ProjectItemType.BIN)) { // For every selected item which isn't a bin or sequence...
									allPathsToStitch += currentItem.getMediaPath();
									allPathsToStitch += ";";
								}
							}
						}
						var AMEString	= "var fe = app.getFrontend(); fe.stitchFiles(\"" + allPathsToStitch + "\"";
						var addendum	= ", \"H.264\", \"" + presetPath + "\", " + "\"(This path parameter is never used)\");";

						AMEString	+= addendum;
						var bt		= new BridgeTalk();
						bt.target	= 'ame';
						bt.body		= AMEString;
						bt.send();
					} else {
						$._PPP_.updateEventPanel("Select more than one render-able item, then try stitching again.");
					}
				}
			}
		}
	},

	myTrackItemAdded : function (track, trackItem) {
		$._PPP_.updateEventPanel('onActiveSequenceTrackItemAdded: ' + track.name + ' : ' + trackItem.name + ' : ' + trackItem.nodeId + ".");
	},

	myTrackItemRemoved : function (track, trackItem) {
		$._PPP_.updateEventPanel('onActiveSequenceTrackItemRemoved: ' + track.name + ' : ' + trackItem.name + ' : ' + trackItem.nodeId + ".");
	},

	mySequenceStructureChanged : function () {
		$._PPP_.updateEventPanel('onActiveSequenceStructureChanged.');
	},

	registerSequenceMessaging : function () {
		app.bind('onActiveSequenceTrackItemRemoved',	$._PPP_.myTrackItemRemoved);
		app.bind('onActiveSequenceTrackItemAdded',		$._PPP_.myTrackItemAdded);
		app.bind('onActiveSequenceStructureChanged',	$._PPP_.mySequenceStructureChanged);
	},

	enumerateTeamProjects : function () {
		var numTeamProjectsOpen = 0;
		for (var i = 0; i < app.projects.numProjects; i++) {
			var project = app.projects[i];
			if (project.isCloudProject) {
				numTeamProjectsOpen++;
				$._PPP_.updateEventPanel(project.name + " is a cloud-based project.");
				var localHubID = project.cloudProjectLocalID;
				$._PPP_.updateEventPanel("LocalHub Id is " + localHubID + ".");
				var production = qe.ea.getProductionByID(localHubID);
				$._PPP_.updateEventPanel("Production Name is " + production.name + ".");
				var remoteID = production.getRemoteProductionID();
				$._PPP_.updateEventPanel("Remote Production Id is " + remoteID + ".");
			}
		}
		if (numTeamProjectsOpen === 0) {
			$._PPP_.updateEventPanel("No open Team Projects found.");
		} else {
			$._PPP_.updateEventPanel(numTeamProjectsOpen + " open Team Projects Team Projects found.");
		}
	},

	enableWorkArea : function (enable) {
		var seq = app.project.activeSequence;
		if (seq) {
			var newStateString = "undefined";
			seq.setWorkAreaEnabled(enable);
			var newState = seq.isWorkAreaEnabled();
			if (newState) {
				newStateString = "ON";
			} else {
				newStateString = "OFF";
			}
			var update = "Work area for " + app.project.activeSequence.name + " is now " + newStateString + ".";
			$._PPP_.updateEventPanel(update);
		} else {
			$._PPP_.updateEventPanel("No active sequence.");
		}
	},

	modifyWorkArea : function () {
		var seq = app.project.activeSequence;
		if (seq) {
			var workAreaIsEnabled = seq.isWorkAreaEnabled();
			if (!workAreaIsEnabled) {
				var confirmString	= "Enable work area for " + seq.name + "?";
				var turnOn			= confirm(confirmString, true, "Are you sure...?");
				if (turnOn) {
					$._PPP_.enableWorkArea(true);
				}
			}
			var oldIn 		= seq.getWorkAreaInPointAsTime();
			var oldOut 		= seq.getWorkAreaOutPointAsTime();
			var newIn 		= oldIn;
			var newOut 		= oldOut;
			var duration 	= oldOut.seconds	- oldIn.seconds;
			newIn.seconds 	= oldIn.seconds		+ 10;
			newOut.seconds 	= oldOut.seconds	- 10;

			seq.setWorkAreaInPoint(newIn.seconds);
			seq.setWorkAreaOutPoint(newOut.seconds);
		}
	},

	setLocale : function (localeFromCEP) {
		$.locale = localeFromCEP;
		$._PPP_.updateEventPanel("ExtendScript Locale set to " + localeFromCEP + ".");
	},

	disableTranscodeOnIngest : function(newValue) {
		return app.setEnableTranscodeOnIngest(newValue);
	},

	generateSystemCompatibilityReport : function() {
		var outputPath 		= new File("~/Desktop");
		var outputFileName 	= outputPath.fsName + $._PPP_.getSep() + "System_Compatibility_Report.txt";
		SystemCompatibilityReport.CreateReport(outputFileName);
		$._PPP_.updateEventPanel("System Compatibility report and project analysis report saved to user's Desktop.");
	},

	changeSequenceColorSpace : function() {
		var seq = app.project.activeSequence;
		if (seq) {
			var currentSeqSettings = seq.getSettings();
			if (currentSeqSettings) {
				if (currentSeqSettings.workingColorSpace === currentSeqSettings.workingColorSpaceList[0]) {
					currentSeqSettings.videoFrameRate.seconds	= 0.04;
					currentSeqSettings.videoDisplayFormat		= 101;
					currentSeqSettings.workingColorSpace		= currentSeqSettings.workingColorSpaceList[1];
					seq.setSettings(currentSeqSettings);
					$._PPP_.updateEventPanel("Changed sequence colorspace from \'" + currentSeqSettings.workingColorSpaceList[0] + "\' to \'" + currentSeqSettings.workingColorSpaceList[1] + "\'.");
				} else {
					currentSeqSettings.workingColorSpace = currentSeqSettings.workingColorSpaceList[0];
					seq.setSettings(currentSeqSettings);
					$._PPP_.updateEventPanel("Changed sequence colorspace to \'" + currentSeqSettings.workingColorSpaceList[0] + "\'.");
				}
				// Now, let's make sure all video clips in the sequence match the sequence's new colorspace.
				for (var trackIndex = 0; trackIndex < seq.videoTracks.numTracks; trackIndex++) {
					var track = seq.videoTracks[trackIndex];
					var clips = track.clips;
					for (var clipIndex = 0; clipIndex < clips.numItems; clipIndex++) {
						var clip = clips[clipIndex];
						if (clip.projectItem) {
							var oldColorSpace = clip.projectItem.getColorSpace();
							clip.projectItem.setOverrideColorSpace(currentSeqSettings.workingColorSpace);
							$._PPP_.updateEventPanel("Previous color space for " + clip.projectItem.name + " was: " + oldColorSpace + ".");
							$._PPP_.updateEventPanel(clip.name + " colorspace changed to \'" + currentSeqSettings.workingColorSpace + "\'.");
						} else {
							$._PPP_.updateEventPanel("No project item available, from " + clip.name + ".");
						}
					}
				}
			} else {
				$._PPP_.updateEventPanel("Could not obtain settings for " + seq.name + ".");
			}
		} else {
			$._PPP_.updateEventPanel("No active sequence.");
		}
	},

	autoReframeActiveSequence : function () {
		var seq = app.project.activeSequence;
		if (seq) {
			if (seq.isDoneAnalyzingForVideoEffects()) {
				var numerator		= 1;
				var denominator		= 1;
				var motionPreset	= "default"; // valid values = "default", "faster", and "slower"
				var newName 		= seq.name + ", auto-reframed by PProPanel.";
				var useNestedSeqs	= false;

				var newSequence = seq.autoReframeSequence(	numerator,
															denominator,
															motionPreset,
															newName,
															useNestedSeqs);

				if (newSequence) {
					$._PPP_.updateEventPanel("Created reframed sequence: " + newName + ".");
				} else {
					$._PPP_.updateEventPanel("Failed to create re-framed sequence: " + newName + ".");
				}
			} else {
				$._PPP_.updateEventPanel("Analysis incomplete; try again later.");
			}
		} else {
			$._PPP_.updateEventPanel("No active sequence.");
		}
	},

	createNewProject : function () {
		var outPath		= Folder.selectDialog("Choose the output directory");
		if (outPath) {
			var projName	= prompt('Name of project?', '', 'Project Naming Prompt');
			if (projName) {
				var completeOutputPath = outPath.fsName + $._PPP_.getSep() + projName;
				var result = app.newProject(completeOutputPath);
				if (result === true) {
					$._PPP_.updateEventPanel("Created project: " + projName + ".");
				} else {
					$._PPP_.updateEventPanel("Failed to create project: " + projName + ".");
				}
			}
		}
	},

	openProduction : function () {
		var openProduction = app.production;
		if (openProduction) {
			var closeFirst = confirm("Close " + openProduction.name + "?", true, "Close open Production?");
			if (closeFirst) {
				openProduction.close();
			}
		}
		var prodFolder		= Folder.selectDialog("Select the Production folder to open.");
		if (prodFolder) {
			var someProduction = app.openPrProduction(prodFolder.fsName);
			if (someProduction) {
				$._PPP_.updateEventPanel("Opened production: " + someProduction.name + ".");
			} else {
				$._PPP_.updateEventPanel("Failed to open production at path: " + prodFolder.fsName + ".");
			}
		}
	},

	toggleProductionLockState : function () {
		var openProduction = app.production;
		if (openProduction) {
			var numOpenProductionProjects = openProduction.projects.length;
			if (numOpenProductionProjects) {
				var preSuffix	= "uninitialized.";
				var postSuffix	= "uninitialized.";
				for (var a = 0; a < numOpenProductionProjects; a++) {
					var currentProject = openProduction.projects[a];
					if (currentProject) {
						var currentLockState = openProduction.getLocked(currentProject);
						if (currentLockState) {
							preSuffix	= "locked.";
							postSuffix	= "unlocked.";
						} else {
							preSuffix	= "unlocked.";
							postSuffix	= "locked.";
						}
						$._PPP_.updateEventPanel(currentProject.name + " was " + preSuffix);
						openProduction.setLocked(currentProject, !currentLockState);
						$._PPP_.updateEventPanel(currentProject.name + " is now " + postSuffix);
					}
				}
			} else {
				$._PPP_.updateEventPanel("No Production projects open.");
			}
		} else {
			$._PPP_.updateEventPanel("No production open.");
		}
	},

	closeAllOpenProductionProjects : function () {
		var openProduction = app.production;
		if (openProduction) {
			var numOpenProductionProjects = openProduction.projects.length;
			if (numOpenProductionProjects) {
				var projArray = [];
				for (var a = 0; a < numOpenProductionProjects; a++) {
					projArray[a] = openProduction.projects[a];
				}
				for (var b = 0; b < numOpenProductionProjects; b++) {
					var currentProject = projArray[b];
					if (currentProject) {
						var saveFirst		=	true;
						var promptIfDirty	=	false;
						$._PPP_.updateEventPanel(currentProject.name + " closed.");
						currentProject.closeDocument(saveFirst, promptIfDirty);
					}
				}
			} else {
				$._PPP_.updateEventPanel("No Production projects open.");
			}
		} else {
			$._PPP_.updateEventPanel("No production open.");
		}
	},

	moveProductionProjectsToTrash : function () {
		var openProduction = app.production;
		if (openProduction) {
			var numOpenProductionProjects = openProduction.projects.length;
			if (numOpenProductionProjects) {
				var projArray = [];
				for (var a = 0; a < numOpenProductionProjects; a++) {
					projArray[a] = openProduction.projects[a];
				}
				for(var c = 0; c < projArray.length; c++) {
					var currentProject = projArray[c];
					$._PPP_.updateEventPanel(currentProject.name + " moved to Trash.");
					var result = openProduction.moveToTrash(currentProject.path, true, true);
				}
			} else {
				$._PPP_.updateEventPanel("No Production projects open.");
			}
		} else {
			$._PPP_.updateEventPanel("No production open.");
		}
	},

	performCutDetection : function () {
		var activeSeq = app.project.activeSequence;
		if (activeSeq) {
			var sel = activeSeq.getSelection();
			if (sel) {
				var action 							= 'ApplyCuts';	//'ApplyCuts', 'CreateMarkers'
				var shouldApplyCutsToLinkedAudio	= true;
				var sensitivity 					= 'LowSensitivity'; //'LowSensitivity', 'MediumSensitivity', 'HighSensitivity'
				var result = activeSeq.performSceneEditDetectionOnSelection(action, shouldApplyCutsToLinkedAudio, sensitivity);
			} else {
				$._PPP_.updateEventPanel("performSceneEditDetectionOnSelection: Nothing selected, in sequence.");
			}
		} else {
			$._PPP_.updateEventPanel("performSceneEditDetectionOnSelection: No active sequence.");
		}
	},

	newSequenceFromProjectSelection : function () {
		var viewIDs         = app.getProjectViewIDs();
        var viewSelection   = app.getProjectViewSelection(viewIDs[0]); // sample code optimized for a single open project
		if (viewSelection) {
			// Note: The sample code doesn't work with bins. Todo: Add code that adds all footage contained in bins to the sequence
			var newSequence = app.project.createNewSequenceFromClips("new sequence", viewSelection, app.project.rootItem);
		} else {
			$._PPP_.updateEventPanel("No project items selected (or a bin was selected).");
		}
	},

	adjustGraphicsWhiteLuminance : function () {
		var supportedValues = app.project.getSupportedGraphicsWhiteLuminances();
		var currentGWL		= app.project.getGraphicsWhiteLuminance();
		var result			= false;

		if (supportedValues && currentGWL) {
			$._PPP_.updateEventPanel("Graphics White Luminance was: " + currentGWL + ".");
			if (currentGWL === 100) {
				result = app.project.setGraphicsWhiteLuminance(supportedValues[1]);
			} else {
				result = app.project.setGraphicsWhiteLuminance(supportedValues[0]);
			}
			$._PPP_.updateEventPanel("Graphics White Luminance changed to: " + app.project.getGraphicsWhiteLuminance() + ".");
		} else {
			$._PPP_.updateEventPanel("Could not obtain valid white luminance values.");
		}
	},

	enableAllDisabledClips : function () { 			
		var clips = app.project.sequences[0].videoTracks[0].clips;
		var numClips = clips.numItems;
		for (var i = 0; i < numClips; i++) {
			var currentClip = clips[i];
			if (currentClip) {
				if (currentClip.disabled === true){ //using new trackItem property, disabled
				currentClip.disabled = false;	
				}
			}
		}
	},
	
	showColorspaceInEvents : function () { 
		var colorSpace 		= app.project.rootItem.children[0].getColorSpace();
		var origColorSpace 	= app.project.rootItem.children[0].getOriginalColorSpace();
		var lutID 			= app.project.rootItem.children[0].getEmbeddedLUTID();
		var inputLutID 		= app.project.rootItem.children[0].getInputLUTID();

		//get the color space info and record it in the events panel
		if (colorSpace){
			if (origColorSpace){
				if (lutID){
					if (inputLutID){
						app.setSDKEventMessage("Color Space " + " = " + colorSpace.name, 'info');
						app.setSDKEventMessage("Transfer Characteristic " + " = " + colorSpace.transferCharacteristic, 'info');
						app.setSDKEventMessage("Color Primaries " + " = " + colorSpace.primaries, 'info');
						app.setSDKEventMessage("Matrix Equation " + " = " + colorSpace.matrixEquation, 'info');
				
						app.setSDKEventMessage("Original Color Space " + " = " + origColorSpace.name, 'info');
						app.setSDKEventMessage("Original Transfer Characteristic " + " = " + origColorSpace.transferCharacteristic, 'info');
						app.setSDKEventMessage("Original Color Primaries " + " = " + origColorSpace.primaries, 'info');
						app.setSDKEventMessage("Original Matrix Equation " + " = " + origColorSpace.matrixEquation, 'info');
				
						app.setSDKEventMessage("LutID " + " = " + lutID, 'info');
						app.setSDKEventMessage("input LutID " + " = " + inputLutID, 'info');
					} else {
						alert("Input LUT ID not found.");
					}
				} else {
					alert("LUT ID not found.");
				}
			} else {
				alert("Original colorspace not available.");
			}
		} else {
			alert("No colorspace available.");
		}
		//get the color space info and record it in the events panel
		if (colorSpace){
			if (origColorSpace){
				if (lutID){
					if (inputLutID){
						app.setSDKEventMessage("Color Space " + " = " + colorSpace.name, 'info');
						app.setSDKEventMessage("Transfer Characteristic " + " = " + colorSpace.transferCharacteristic, 'info');
						app.setSDKEventMessage("Color Primaries " + " = " + colorSpace.primaries, 'info');
						app.setSDKEventMessage("Matrix Equation " + " = " + colorSpace.matrixEquation, 'info');
				
						app.setSDKEventMessage("Original Color Space " + " = " + origColorSpace.name, 'info');
						app.setSDKEventMessage("Original Transfer Characteristic " + " = " + origColorSpace.transferCharacteristic, 'info');
						app.setSDKEventMessage("Original Color Primaries " + " = " + origColorSpace.primaries, 'info');
						app.setSDKEventMessage("Original Matrix Equation " + " = " + origColorSpace.matrixEquation, 'info');
				
						app.setSDKEventMessage("LutID " + " = " + lutID, 'info');
						app.setSDKEventMessage("input LutID " + " = " + inputLutID, 'info');
					} else {
						alert("Input LUT ID not found.");
					}
				} else {
					alert("LUT ID not found.");
				}
			} else {
				alert("Original colorspace not available.");
			}
		} else {
			alert("No colorspace available.");
		}
	},
	moveTrackItemOnTimeline : function () {	
		app.project.sequences[0].audioTracks[0].clips[0].move(13);
 		app.project.sequences[0].videoTracks[0].clips[0].move(13);
	},

	importSrtAddToCaptionTrack: function() {
        var destBin = app.project.getInsertionBin();
        if (destBin) {
            var prevItemCount = destBin.children.numItems;

            var filterString = "";
            if (Folder.fs === 'Windows') {
                filterString = "All files:*.*";
            }
            if (app.project) {
                var importThese = [];
                var fileOrFilesToImport = File.openDialog("Choose files to import", // title
                    filterString, // filter available files?
                    true); // allow multiple?
                if (fileOrFilesToImport) {
                    // We have an array of File objects; importFiles() takes an array of paths.
                    if (importThese) {
                        for (var i = 0; i < fileOrFilesToImport.length; i++) {
                            importThese[i] = fileOrFilesToImport[i].fsName;
                        }
                        var suppressWarnings = true;
                        var importAsStills = false;
                        app.project.importFiles(importThese,
                            suppressWarnings,
                            app.project.getInsertionBin(),
                            importAsStills);

                    } else {
                        $._PPP_.updateEventPanel("No files to import.");
                    }
                }

                if (importThese) {
                    var newItemCount = destBin.children.numItems;
                    if (newItemCount > prevItemCount) {
                        var importedSRT = destBin.children[(newItemCount - 1)];
                        if (importedSRT) {
                            var activeSeq = app.project.activeSequence;
                            if (activeSeq) {
                                var startAtTime = 0;
                                var result = app.project.activeSequence.createCaptionTrack(importedSRT, startAtTime);
                            } else {
                                $._PPP_.updateEventPanel("No active sequence.");
                            }
                        } else {
                            $._PPP_.updateEventPanel("Whoops, couldn't find imported .srt file.");
                        }
                    } else {
                        $._PPP_.updateEventPanel("Whoa, no new item? How'd THAT happen?!");
                    }
                } else {
                    $._PPP_.updateEventPanel("importFiles() failed to import, OR return an error message. I quit!");
                }
            } else {
                $._PPP_.updateEventPanel("No destination bin available");
            }
        }
    },

	checkMacFileType : function(file) {
		if (!file instanceof Folder){
			return true;
		}

		var index = file.name.lastIndexOf(".");
		var ext = file.name.substring(index + 1);

		if(ext == "xml" || ext == "XML") {
			return true;
		} else {
			return false;
		}
	},

	// ===================================================
	// Lasker Studio Utilities (Migrated from UXP)
	// ===================================================

	/**
	 * safeGetValue: \uac12\uc744 \uc548\uc804\ud558\uac8c \uac00\uc838\uc624\ub294 \ud5ec\ud37c \ud568\uc218
	 * - \ud568\uc218\uba74 \uc2e4\ud589
	 * - Promise-like \uac1d\uccb4\uba74 \uae30\ub2e4\ub9bc (then \uba54\uc11c\ub4dc \ud638\ucd9c)
	 * - \uadf8 \uc678\uc5d0\ub294 \uadf8\ub300\ub85c \ubc18\ud658
	 * - \uc5d0\ub7ec \ubc1c\uc0dd \uc2dc null \ubc18\ud658
	 */
	safeGetValue: function(value) {
		try {
			if (typeof value === "function") {
				var result = value();
				// If result has a then method, it's promise-like
				if (result && typeof result === "object" && typeof result.then === "function") {
					return result;
				}
				return result;
			}

			// Check if value is promise-like
			if (value && typeof value === "object" && typeof value.then === "function") {
				return value;
			}

			return value;
		} catch (error) {
			return null;
		}
	},

	/**
	 * tickToObj: Premiere Pro \uc758 tick time \uac1d\uccb4\ub97c \ud45c\uc900 \uac1d\uccb4\ub85c \ubcc0\ud658
	 */
	tickToObj: function(t) {
		if (!t) {
			return null;
		}

		try {
			var seconds = $._PPP_.safeGetValue(function() { return t.seconds; });
			var ticks = $._PPP_.safeGetValue(function() { return t.ticks; });
			var ticksNumber = $._PPP_.safeGetValue(function() { return t.ticksNumber; });

			if (seconds !== null || ticks !== null || ticksNumber !== null) {
				var ticksValue = ticks;
				if (typeof ticks === "string") {
					ticksValue = parseInt(ticks) || 0;
				}

				return {
					seconds: seconds || 0,
					ticks: ticksValue || 0,
					ticksNumber: ticksNumber || 0
				};
			}

			if (typeof t === "number") {
				return {
					seconds: 0,
					ticks: t,
					ticksNumber: t
				};
			}

			return null;
		} catch (e) {
			return null;
		}
	},

	/**
	 * projectItemToSource: \ud504\ub85c\uc81d\ud2b8 \uc544\uc774\ud15c\uc744 MediaSource \uac1d\uccb4\ub85c \ubcc0\ud658
	 */
	projectItemToSource: function(projectItem, preferProxy) {
		if (!projectItem) return null;

		var itemName = "";
		var itemGuid = "";
		var mediaFilePath = "";

		// Get name
		try {
			if (projectItem.name) {
				itemName = projectItem.name;
			}
		} catch (e) {}

		// Get guid (nodeId in CEP)
		try {
			if (projectItem.nodeId) {
				itemGuid = projectItem.nodeId;
			}
		} catch (e) {}

		// Get media path
		try {
			if (typeof projectItem.getMediaPath === "function") {
				mediaFilePath = projectItem.getMediaPath();
			}
		} catch (e) {}

		return {
			name: itemName || "",
			guid: itemGuid || "",
			mediaPath: mediaFilePath || ""
		};
	},

	/**
	 * dumpTrackItems: \ud2b8\ub799\uc5d0\uc11c \ubaa8\ub4e0 \ud2b8\ub799 \uc544\uc774\ud15c\ub4e4\uc744 \ucd94\ucd9c
	 */
	dumpTrackItems: function(track) {
		var trackItems = [];

		if (!track || !track.clips) {
			return trackItems;
		}

		var numItems = track.clips.numItems;

		for (var i = 0; i < numItems; i++) {
			var trackItem = track.clips[i];
			if (!trackItem) {
				continue;
			}

			var itemName = "";
			var itemType = 1;
			var itemTrackIndex = 0;
			var isDisabled = false;
			var isAdjustmentLayer = false;
			var playbackSpeed = 1;
			var isSpeedReversed = false;
			var projectItem = null;

			// Get basic properties
			try {
				if (trackItem.name) itemName = trackItem.name;
				if (trackItem.type !== undefined) itemType = trackItem.type;
				if (trackItem.disabled !== undefined) isDisabled = trackItem.disabled;
			} catch (e) {}

			// Get timing information
			var startTime = null;
			var endTime = null;
			var duration = null;
			var inPoint = null;
			var outPoint = null;

			try {
				if (trackItem.start) startTime = trackItem.start;
				if (trackItem.end) endTime = trackItem.end;
				if (trackItem.duration) duration = trackItem.duration;
				if (trackItem.inPoint) inPoint = trackItem.inPoint;
				if (trackItem.outPoint) outPoint = trackItem.outPoint;
			} catch (e) {}

			// Get project item (source)
			try {
				if (trackItem.projectItem) {
					projectItem = trackItem.projectItem;
				}
			} catch (e) {}

			var sourceInfo = $._PPP_.projectItemToSource(projectItem);

			if (!itemName && sourceInfo && sourceInfo.name) {
				itemName = sourceInfo.name;
			}

			var processedTrackItem = {
				name: itemName,
				type: itemType,
				trackIndex: itemTrackIndex,
				isAdjustmentLayer: !!isAdjustmentLayer,
				disabled: !!isDisabled,
				speed: playbackSpeed,
				reversed: !!isSpeedReversed,
				seqStart: $._PPP_.tickToObj(startTime),
				seqEnd: $._PPP_.tickToObj(endTime),
				seqDuration: $._PPP_.tickToObj(duration),
				srcIn: $._PPP_.tickToObj(inPoint),
				srcOut: $._PPP_.tickToObj(outPoint),
				source: sourceInfo
			};

			trackItems.push(processedTrackItem);
		}

		return trackItems;
	},

	/**
	 * getProjectSequences: \ud504\ub85c\uc81d\ud2b8\uc758 \ubaa8\ub4e0 \uc2dc\ud000\uc2a4 \ubaa9\ub85d\uc744 \uac00\uc838\uc634
	 */
	getProjectSequences: function() {
		var sequences = [];

		if (!app.project || !app.project.sequences) {
			return [];
		}

		var numSequences = app.project.sequences.numSequences;

		for (var i = 0; i < numSequences; i++) {
			var sequence = app.project.sequences[i];
			if (!sequence) continue;

			var sequenceData = {
				id: i.toString(),
				name: sequence.name || "",
				guid: sequence.sequenceID || "",
				timebase: 0,
				duration: 0,
				inPoint: 0,
				outPoint: 0,
				endTime: 0,
				videoTracks: 0,
				audioTracks: 0,
				markers: 0
			};

			// Get sequence settings
			try {
				var settings = sequence.getSettings();
				if (settings && settings.videoFrameRate) {
					sequenceData.timebase = 1 / settings.videoFrameRate.seconds;
				}
			} catch (e) {}

			// Get timing info
			try {
				if (sequence.end) {
					var endTime = $._PPP_.tickToObj(sequence.end);
					if (endTime) {
						sequenceData.endTime = endTime.seconds || 0;
						sequenceData.duration = endTime.seconds || 0;
					}
				}

				if (sequence.zeroPoint) {
					var zeroPoint = $._PPP_.tickToObj(sequence.zeroPoint);
					if (zeroPoint) {
						sequenceData.inPoint = zeroPoint.seconds || 0;
					}
				}

				sequenceData.outPoint = sequenceData.endTime;
			} catch (e) {}

			// Count tracks
			try {
				if (sequence.videoTracks) {
					sequenceData.videoTracks = sequence.videoTracks.numTracks || 0;
				}
				if (sequence.audioTracks) {
					sequenceData.audioTracks = sequence.audioTracks.numTracks || 0;
				}
			} catch (e) {}

			// Count markers
			try {
				if (sequence.markers) {
					sequenceData.markers = sequence.markers.numMarkers || 0;
				}
			} catch (e) {}

			sequences.push(sequenceData);
		}

		return sequences;
	},

	/**
	 * getProjectSequencesSimple: 시퀀스 목록 (최소 정보만)
	 */
	getProjectSequencesSimple: function() {
		var sequences = [];
		try {
			if (!app.project || !app.project.sequences) {
				return [];
			}
			var numSequences = app.project.sequences.numSequences;
			for (var i = 0; i < numSequences; i++) {
				try {
					var seq = app.project.sequences[i];
					if (seq) {
						sequences.push({
							id: i.toString(),
							name: seq.name || "Untitled",
							guid: seq.sequenceID || "",
							videoTracks: seq.videoTracks ? seq.videoTracks.numTracks : 0,
							audioTracks: seq.audioTracks ? seq.audioTracks.numTracks : 0
						});
					}
				} catch (e) {}
			}
		} catch (e) {}
		return sequences;
	},

	/**
	 * getSequenceSnapshot: \ud2b9\uc815 \uc2dc\ud000\uc2a4\uc758 \uc0c1\uc138 \uc815\ubcf4\ub97c \uac00\uc838\uc634
	 */
	getSequenceSnapshot: function(sequenceId) {
		if (!app.project || !app.project.sequences) {
			return null;
		}

		var sequenceIndex = parseInt(sequenceId);
		if (isNaN(sequenceIndex) || sequenceIndex < 0) {
			return null;
		}

		if (sequenceIndex >= app.project.sequences.numSequences) {
			return null;
		}

		var sequence = app.project.sequences[sequenceIndex];
		if (!sequence) {
			return null;
		}

		return $._PPP_.getSequenceSnapshotFromSequence(sequence);
	},

	/**
	 * getSequenceSnapshotFromSequence: \uc2dc\ud000\uc2a4 \uac1d\uccb4\ub85c\ubd80\ud130 \uc0c1\uc138 \uc815\ubcf4\ub97c \ucd94\ucd9c
	 */
	getSequenceSnapshotFromSequence: function(sequence) {
		if (!sequence) {
			return null;
		}

		var snapshot = {
			sequence: {
				name: sequence.name || "",
				guid: sequence.sequenceID || "",
				timebase: null,
				zeroPoint: null,
				inPoint: null,
				outPoint: null,
				endTime: null,
				settings: null
			},
			videoTracks: [],
			audioTracks: [],
			markers: []
		};

		// Get sequence settings
		try {
			var settings = sequence.getSettings();
			if (settings) {
				snapshot.sequence.settings = {
					frameRate: settings.videoFrameRate ? (1 / settings.videoFrameRate.seconds) : 0
				};
				snapshot.sequence.timebase = settings.videoFrameRate ? (1 / settings.videoFrameRate.seconds) : 0;
			}
		} catch (e) {}

		// Get timing information
		try {
			if (sequence.zeroPoint) {
				snapshot.sequence.zeroPoint = $._PPP_.tickToObj(sequence.zeroPoint);
			}
			if (sequence.end) {
				snapshot.sequence.endTime = $._PPP_.tickToObj(sequence.end);
			}
		} catch (e) {}

		// Get video tracks
		try {
			if (sequence.videoTracks) {
				var numVideoTracks = sequence.videoTracks.numTracks;
				for (var i = 0; i < numVideoTracks; i++) {
					var videoTrack = sequence.videoTracks[i];
					if (!videoTrack) continue;

					var trackData = {
						index: i,
						name: videoTrack.name || ("V" + (i + 1)),
						items: $._PPP_.dumpTrackItems(videoTrack)
					};
					snapshot.videoTracks.push(trackData);
				}
			}
		} catch (e) {}

		// Get audio tracks
		try {
			if (sequence.audioTracks) {
				var numAudioTracks = sequence.audioTracks.numTracks;
				for (var j = 0; j < numAudioTracks; j++) {
					var audioTrack = sequence.audioTracks[j];
					if (!audioTrack) continue;

					var audioTrackData = {
						index: j,
						name: audioTrack.name || ("A" + (j + 1)),
						items: $._PPP_.dumpTrackItems(audioTrack)
					};
					snapshot.audioTracks.push(audioTrackData);
				}
			}
		} catch (e) {}

		// Get markers
		try {
			if (sequence.markers && sequence.markers.numMarkers > 0) {
				var currentMarker = sequence.markers.getFirstMarker();
				while (currentMarker !== undefined) {
					var markerData = {
						name: currentMarker.name || "",
						start: $._PPP_.tickToObj(currentMarker.start),
						duration: null,
						type: currentMarker.type || "",
						color: currentMarker.color || "",
						comments: currentMarker.comments || "",
						url: "",
						target: ""
					};

					if (currentMarker.end && currentMarker.start) {
						var endTick = $._PPP_.tickToObj(currentMarker.end);
						var startTick = $._PPP_.tickToObj(currentMarker.start);
						if (endTick && startTick) {
							markerData.duration = {
								seconds: endTick.seconds - startTick.seconds,
								ticks: endTick.ticks - startTick.ticks,
								ticksNumber: endTick.ticksNumber - startTick.ticksNumber
							};
						}
					}

					snapshot.markers.push(markerData);
					currentMarker = sequence.markers.getNextMarker(currentMarker);
				}
			}
		} catch (e) {}

		return snapshot;
	},

	/**
	 * exportSequenceData: \uc2dc\ud000\uc2a4 \ub370\uc774\ud130\ub97c JSON\uc73c\ub85c \ub0b4\ubcf4\ub0b4\uae30
	 */
	exportSequenceData: function(sequenceId) {
		var snapshot = $._PPP_.getSequenceSnapshot(sequenceId);

		if (!snapshot) {
			return null;
		}
		
		var now = new Date();
		var dateStr = now.getFullYear() + '-' +
			('0' + (now.getMonth() + 1)).slice(-2) + '-' +
			('0' + now.getDate()).slice(-2) + 'T' +
			('0' + now.getHours()).slice(-2) + ':' +
			('0' + now.getMinutes()).slice(-2) + ':' +
			('0' + now.getSeconds()).slice(-2) + 'Z';

		var exportData = {
			metadata: {
				exportedAt: dateStr,
				version: "1.0.0",
				source: "Adobe Premiere Pro CEP"
			},
			timeline: snapshot,
			statistics: {
				videoTrackCount: snapshot.videoTracks.length,
				audioTrackCount: snapshot.audioTracks.length,
				markerCount: snapshot.markers.length,
				totalClipCount: 0
			}
		};

		// Calculate total clip count
		for (var i = 0; i < snapshot.videoTracks.length; i++) {
			exportData.statistics.totalClipCount += snapshot.videoTracks[i].items.length;
		}
		for (var j = 0; j < snapshot.audioTracks.length; j++) {
			exportData.statistics.totalClipCount += snapshot.audioTracks[j].items.length;
		}

		return exportData;
	},

	/**
	 * exportActiveSequenceData: \ud604\uc7ac \ud65c\uc131 \uc2dc\ud000\uc2a4\uc758 \ub370\uc774\ud130\ub97c \ub0b4\ubcf4\ub0b4\uae30
	 */
	exportActiveSequenceData: function() {
		if (!app.project || !app.project.activeSequence) {
			return null;
		}

		var sequence = app.project.activeSequence;
		var snapshot = $._PPP_.getSequenceSnapshotFromSequence(sequence);

		if (!snapshot) {
			return null;
		}

		// Format date for ExtendScript (toISOString not supported)
		var now = new Date();
		var dateStr = now.getFullYear() + '-' +
			('0' + (now.getMonth() + 1)).slice(-2) + '-' +
			('0' + now.getDate()).slice(-2) + 'T' +
			('0' + now.getHours()).slice(-2) + ':' +
			('0' + now.getMinutes()).slice(-2) + ':' +
			('0' + now.getSeconds()).slice(-2) + 'Z';

		var exportData = {
			metadata: {
				exportedAt: dateStr,
				version: "1.0.0",
				source: "Adobe Premiere Pro CEP"
			},
			timeline: snapshot,
			statistics: {
				videoTrackCount: snapshot.videoTracks.length,
				audioTrackCount: snapshot.audioTracks.length,
				markerCount: snapshot.markers.length,
				totalClipCount: 0
			}
		};

		// Calculate total clip count
		for (var i = 0; i < snapshot.videoTracks.length; i++) {
			exportData.statistics.totalClipCount += snapshot.videoTracks[i].items.length;
		}
		for (var j = 0; j < snapshot.audioTracks.length; j++) {
			exportData.statistics.totalClipCount += snapshot.audioTracks[j].items.length;
		}

		return exportData;
	},

	/**
	 * generateSequenceThumbnail: 시퀀스의 썸네일 생성 (UXP 방식과 동일하게 실제 이미지 export)
	 * @param {string} sequenceId - 시퀀스 ID (format: "seq_0", "seq_1", etc.)
	 * @param {number} timestamp - 썸네일을 생성할 타임스탬프 (초 단위, 기본값: 5)
	 * @returns {object} { sequenceId, thumbnailData, timestamp }
	 */
	generateSequenceThumbnail: function(sequenceId, timestamp) {
		if (!app.project) {
			return null;
		}

		timestamp = timestamp || 5;

		// Parse sequence index - sequenceId is just the index as string now
		var seqIndex = parseInt(sequenceId);
		if (isNaN(seqIndex) || seqIndex < 0 || seqIndex >= app.project.sequences.numSequences) {
			return null;
		}

		var targetSequence = app.project.sequences[seqIndex];
		if (!targetSequence) {
			return null;
		}

		var thumbnailData = null;
		var debugInfo = [];

		// Method 1: Skip QE export for now - too slow and blocks Premiere
		// Will use simpler fallback approach
		debugInfo.push("Skipping QE export (performance issue)");

		// Method 2: Try getting first clip's media path as fallback
		if (!thumbnailData) {
			debugInfo.push("Trying fallback: media file path");
			try {
				if (targetSequence.videoTracks && targetSequence.videoTracks.numTracks > 0) {
					for (var i = 0; i < targetSequence.videoTracks.numTracks; i++) {
						var track = targetSequence.videoTracks[i];
						if (track && track.clips && track.clips.numItems > 0) {
							var firstClip = track.clips[0];
							if (firstClip && firstClip.projectItem && firstClip.projectItem.getMediaPath) {
								var mediaPath = firstClip.projectItem.getMediaPath();
								if (mediaPath) {
									thumbnailData = "file://" + mediaPath;
									debugInfo.push("Got media path: " + mediaPath);
									break;
								}
							}
						}
					}
				}
			} catch (e) {
				debugInfo.push("Error getting media path: " + e.toString());
			}
		}

		// If no media path found, return dummy
		if (!thumbnailData) {
			thumbnailData = "dummy";
			debugInfo.push("Using dummy thumbnail");
		}

		return {
			sequenceId: sequenceId,
			thumbnailData: thumbnailData,
			timestamp: timestamp,
			debug: debugInfo.join(" | ")
		};
	},

	/**
	 * bytesToBase64: Convert binary bytes to base64 string
	 * @param {string} bytes - Binary string
	 * @returns {string} Base64 encoded string
	 */
	bytesToBase64: function(bytes) {
		var base64chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/";
		var result = "";
		var length = bytes.length;
		var i = 0;

		while (i < length) {
			var a = bytes.charCodeAt(i++) & 0xff;
			var b = i < length ? bytes.charCodeAt(i++) & 0xff : 0;
			var c = i < length ? bytes.charCodeAt(i++) & 0xff : 0;

			var bitmap = (a << 16) | (b << 8) | c;

			result += base64chars.charAt((bitmap >> 18) & 0x3F);
			result += base64chars.charAt((bitmap >> 12) & 0x3F);
			result += i - 1 < length ? base64chars.charAt((bitmap >> 6) & 0x3F) : "=";
			result += i < length ? base64chars.charAt(bitmap & 0x3F) : "=";
		}

		return result;
	},

	getMediaFilePaths: function(sequenceCreateData, uploadUrls) {
		try {
			$._PPP_.updateEventPanel('Getting media file paths');

			var result = {
				success: true,
				mediaFiles: [],
				errors: []
			};

			var mediaPaths = {};
			var mediaNames = {};

			for (var i = 0; i < sequenceCreateData.videoTracks.length; i++) {
				var track = sequenceCreateData.videoTracks[i];
				for (var j = 0; j < track.items.length; j++) {
					var item = track.items[j];
					if (item.source && item.source.mediaPath) {
						var guid = item.source.guid;
						mediaPaths[guid] = item.source.mediaPath;
						mediaNames[guid] = item.source.name;
					}
				}
			}

			$._PPP_.updateEventPanel('Found ' + Object.keys(mediaPaths).length + ' unique media files');

			for (var k = 0; k < uploadUrls.length; k++) {
				var uploadInfo = uploadUrls[k];
				var uploadFilename = uploadInfo.filename;

				$._PPP_.updateEventPanel('Processing ' + (k + 1) + '/' + uploadUrls.length + ': ' + uploadFilename);

				var matchedPath = null;
				var matchedGuid = null;

				for (var guid in mediaNames) {
					if (mediaNames.hasOwnProperty(guid)) {
						var mediaName = mediaNames[guid];
						if (mediaName.toLowerCase() === uploadFilename.toLowerCase()) {
							matchedPath = mediaPaths[guid];
							matchedGuid = guid;
							break;
						}
					}
				}

				if (matchedPath) {
					var file = new File(matchedPath);

					if (file.exists) {
						result.mediaFiles.push({
							contentId: uploadInfo.contentId,
							filename: uploadInfo.filename,
							mediaPath: matchedPath,
							fileSize: file.length,
							uploadUrl: uploadInfo.uploadUrl,
							uploadCallbackUrl: uploadInfo.uploadCallbackUrl
						});
						$._PPP_.updateEventPanel('Found file: ' + file.name + ' (' + file.length + ' bytes)');
					} else {
						result.errors.push({
							contentId: uploadInfo.contentId,
							filename: uploadInfo.filename,
							error: 'File does not exist: ' + matchedPath
						});
					}
				} else {
					result.errors.push({
						contentId: uploadInfo.contentId,
						filename: uploadInfo.filename,
						error: 'No matching media file found'
					});
				}
			}

			if (result.errors.length > 0) {
				result.success = false;
			}

			$._PPP_.updateEventPanel('Media file mapping complete. Found: ' + result.mediaFiles.length + ', Errors: ' + result.errors.length);

			return result;
		} catch (e) {
			$._PPP_.updateEventPanel('getMediaFilePaths error: ' + e.toString());
			return {
				success: false,
				error: e.toString(),
				mediaFiles: [],
				errors: []
			};
		}
	},

	/**
	 * readFileAsBase64: 파일을 Base64 문자열로 읽음
	 * @param {string} filePath - 읽을 파일의 전체 경로
	 * @param {number} chunkSize - 청크 크기 (바이트). 큰 파일의 경우 메모리 관리를 위해 사용
	 * @returns {object} - success, data (base64), fileName, fileSize 포함
	 */
	readFileAsBase64: function(filePath, chunkSize) {
		try {
			var file = new File(filePath);

			if (!file.exists) {
				return JSON.stringify({
					success: false,
					message: "File not found: " + filePath,
					data: null
				});
			}

			// 파일 크기 확인
			var fileSize = file.length;
			var maxSize = 500 * 1024 * 1024; // 500MB 제한

			if (fileSize > maxSize) {
				return JSON.stringify({
					success: false,
					message: "File too large (max 500MB): " + (fileSize / 1024 / 1024).toFixed(2) + " MB",
					data: null
				});
			}

			// 파일 열기
			if (!file.open('r')) {
				return JSON.stringify({
					success: false,
					message: "Failed to open file",
					data: null
				});
			}

			file.encoding = 'BINARY';
			var fileContent = file.read();
			file.close();

			if (!fileContent) {
				return JSON.stringify({
					success: false,
					message: "Failed to read file content",
					data: null
				});
			}

			// Base64 인코딩
			var base64 = '';
			var bytes = [];

			for (var i = 0; i < fileContent.length; i++) {
				bytes.push(fileContent.charCodeAt(i) & 0xff);
			}

			// Base64 인코딩 (수동 구현)
			var base64chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/';
			var paddingChar = '=';

			for (var i = 0; i < bytes.length; i += 3) {
				var b1 = bytes[i];
				var b2 = i + 1 < bytes.length ? bytes[i + 1] : 0;
				var b3 = i + 2 < bytes.length ? bytes[i + 2] : 0;

				var enc1 = b1 >> 2;
				var enc2 = ((b1 & 3) << 4) | (b2 >> 4);
				var enc3 = ((b2 & 15) << 2) | (b3 >> 6);
				var enc4 = b3 & 63;

				if (i + 1 >= bytes.length) {
					enc3 = enc4 = 64;
				} else if (i + 2 >= bytes.length) {
					enc4 = 64;
				}

				base64 += base64chars.charAt(enc1) + base64chars.charAt(enc2);
				base64 += (enc3 === 64 ? paddingChar : base64chars.charAt(enc3));
				base64 += (enc4 === 64 ? paddingChar : base64chars.charAt(enc4));
			}

			return JSON.stringify({
				success: true,
				data: base64,
				fileName: file.name,
				fileSize: fileSize,
				filePath: filePath
			});

		} catch (e) {
			return JSON.stringify({
				success: false,
				message: "Error reading file: " + e.toString(),
				data: null
			});
		}
	},

	/**
	 * getSequenceVideoFiles: 시퀀스에 사용된 고유한 비디오 파일 목록을 가져옴
	 */
	getSequenceVideoFiles: function() {
		try {
			var activeSequence = app.project.activeSequence;
			if (!activeSequence) {
				return JSON.stringify({
					success: false,
					message: "No active sequence",
					files: []
				});
			}

			var videoFilesMap = {}; // 중복 제거를 위한 맵
			var videoFiles = [];

			// 모든 비디오 트랙 순회
			var numVideoTracks = activeSequence.videoTracks.numTracks;
			for (var trackIndex = 0; trackIndex < numVideoTracks; trackIndex++) {
				var track = activeSequence.videoTracks[trackIndex];
				if (!track || !track.clips) continue;

				var numClips = track.clips.numItems;
				for (var clipIndex = 0; clipIndex < numClips; clipIndex++) {
					var clip = track.clips[clipIndex];
					if (!clip || !clip.projectItem) continue;

					var projectItem = clip.projectItem;

					// 비디오 파일인지 확인
					var itemType = projectItem.type;
					if (itemType !== ProjectItemType.CLIP && itemType !== ProjectItemType.FILE) {
						continue;
					}

					// 미디어 경로 가져오기
					var mediaPath = "";
					try {
						if (typeof projectItem.getMediaPath === "function") {
							mediaPath = projectItem.getMediaPath();
						}
					} catch (e) {}

					// 경로가 없거나 이미 추가된 파일이면 스킵
					if (!mediaPath || videoFilesMap[mediaPath]) {
						continue;
					}

					// 파일 정보 수집
					var fileInfo = {
						name: projectItem.name || "",
						path: mediaPath,
						nodeId: projectItem.nodeId || "",
						duration: 0,
						frameRate: 0,
						width: 0,
						height: 0
					};

					// 추가 메타데이터
					try {
						if (projectItem.getOutPoint && projectItem.getInPoint) {
							var inPoint = projectItem.getInPoint();
							var outPoint = projectItem.getOutPoint();
							if (inPoint && outPoint) {
								fileInfo.duration = (outPoint.seconds - inPoint.seconds);
							}
						}
					} catch (e) {}

					try {
						if (projectItem.getVideoFrameRate) {
							var frameRate = projectItem.getVideoFrameRate();
							if (frameRate && frameRate.seconds) {
								fileInfo.frameRate = 1 / frameRate.seconds;
							}
						}
					} catch (e) {}

					try {
						if (projectItem.getVideoFrameDimensions) {
							var dimensions = projectItem.getVideoFrameDimensions();
							if (dimensions) {
								fileInfo.width = dimensions.width || 0;
								fileInfo.height = dimensions.height || 0;
							}
						}
					} catch (e) {}

					videoFilesMap[mediaPath] = true;
					videoFiles.push(fileInfo);
				}
			}

			return JSON.stringify({
				success: true,
				sequenceName: activeSequence.name || "",
				files: videoFiles
			});

		} catch (e) {
			return JSON.stringify({
				success: false,
				message: "Error: " + e.toString(),
				files: []
			});
		}
	},

	/**
	 * getProjectVideoFilesSimple: 간단한 테스트 버전
	 */
	getProjectVideoFilesSimple: function() {
		$.writeln("[getProjectVideoFilesSimple] Starting...");

		try {
			if (!app.project) {
				return JSON.stringify({
					success: false,
					message: "No active project",
					files: []
				});
			}

			var videoFiles = [];
			var rootItem = app.project.rootItem;

			if (rootItem && rootItem.children) {
				var numChildren = rootItem.children.numItems;
				$.writeln("[getProjectVideoFilesSimple] Root has " + numChildren + " items");

				// 첫 번째 레벨만 스캔 (빠른 테스트)
				for (var i = 0; i < numChildren; i++) {
					var item = rootItem.children[i];
					if (!item) continue;

					var itemType = item.type;
					if (itemType === ProjectItemType.CLIP || itemType === ProjectItemType.FILE) {
						try {
							var mediaPath = item.getMediaPath ? item.getMediaPath() : "";
							if (mediaPath) {
								videoFiles.push({
									name: item.name || "",
									path: mediaPath,
									nodeId: item.nodeId || "",
									duration: 0,
									frameRate: 0,
									width: 0,
									height: 0
								});
							}
						} catch (e) {
							$.writeln("[getProjectVideoFilesSimple] Error: " + e);
						}
					}
				}
			}

			$.writeln("[getProjectVideoFilesSimple] Found " + videoFiles.length + " videos");
			return JSON.stringify({
				success: true,
				projectName: app.project.name || "",
				files: videoFiles
			});

		} catch (e) {
			$.writeln("[getProjectVideoFilesSimple] Error: " + e);
			return JSON.stringify({
				success: false,
				message: "Error: " + e.toString(),
				files: []
			});
		}
	},

	/**
	 * getProjectVideoFiles: 프로젝트에 불러온 모든 비디오 파일 목록을 가져옴
	 */
	getProjectVideoFiles: function() {
		try {
			$.writeln("[getProjectVideoFiles] Starting...");

			if (!app.project) {
				$.writeln("[getProjectVideoFiles] No active project");
				return JSON.stringify({
					success: false,
					message: "No active project",
					files: []
				});
			}

			$.writeln("[getProjectVideoFiles] Project found: " + app.project.name);
			var videoFiles = [];

			// 재귀적으로 프로젝트 아이템을 탐색하는 함수
			function traverseProjectItems(item, depth) {
				if (!item) return;

				try {
					// 비디오 클립인 경우
					var itemType = item.type;
					if (itemType === ProjectItemType.CLIP || itemType === ProjectItemType.FILE) {
						// 미디어 경로 가져오기
						var mediaPath = "";
						try {
							if (typeof item.getMediaPath === "function") {
								mediaPath = item.getMediaPath();
							}
						} catch (e) {
							$.writeln("[traverseProjectItems] Error getting media path: " + e);
						}

					if (mediaPath) {
						// 파일 정보 수집 (메타데이터 수집 최소화)
						var fileInfo = {
							name: item.name || "",
							path: mediaPath,
							nodeId: item.nodeId || "",
							duration: 0,
							frameRate: 0,
							width: 0,
							height: 0
						};

						videoFiles.push(fileInfo);

						// 진행 상황 로깅 (100개마다)
						if (videoFiles.length % 100 === 0) {
							$.writeln("[traverseProjectItems] Found " + videoFiles.length + " videos so far...");
						}
					}
				}

				// 빈(bin) 폴더인 경우 재귀적으로 탐색
				if (itemType === ProjectItemType.BIN && item.children) {
					$.writeln("[traverseProjectItems] Found bin: " + item.name + " with " + item.children.numItems + " children");
					var numChildren = item.children.numItems;
					for (var i = 0; i < numChildren; i++) {
						traverseProjectItems(item.children[i], depth + 1);
					}
				}
				} catch (e) {
					$.writeln("[traverseProjectItems] Error processing item: " + e);
				}
			}

			// 루트 아이템부터 시작
			$.writeln("[getProjectVideoFiles] Starting to traverse project items...");
			var rootItem = app.project.rootItem;
			if (rootItem && rootItem.children) {
				var numChildren = rootItem.children.numItems;
				$.writeln("[getProjectVideoFiles] Root has " + numChildren + " items");
				for (var i = 0; i < numChildren; i++) {
					traverseProjectItems(rootItem.children[i], 0);
				}
			}

			$.writeln("[getProjectVideoFiles] Found total " + videoFiles.length + " videos");
			return JSON.stringify({
				success: true,
				projectName: app.project.name || "",
				files: videoFiles
			});

		} catch (e) {
			$.writeln("[getProjectVideoFiles] Error: " + e);
			return JSON.stringify({
				success: false,
				message: "Error: " + e.toString(),
				files: []
			});
		}
	},

	/**
	 * navigateToTime: Navigate to a specific time in the sequence
	 * @param {string} sequenceId - Sequence ID
	 * @param {number} timeInSeconds - Time in seconds to navigate to
	 * @returns {object} Result with success status
	 */
	navigateToTime: function(sequenceId, timeInSeconds) {
		try {
			if (!app.project) {
				return {
					success: false,
					message: "No project open"
				};
			}

			// Parse sequence index
			var seqIndex = parseInt(sequenceId);
			if (isNaN(seqIndex) || seqIndex < 0 || seqIndex >= app.project.sequences.numSequences) {
				return {
					success: false,
					message: "Invalid sequence ID: " + sequenceId
				};
			}

			var targetSequence = app.project.sequences[seqIndex];
			if (!targetSequence) {
				return {
					success: false,
					message: "Sequence not found"
				};
			}

			// Set the sequence as active
			app.project.activeSequence = targetSequence;

			// Convert seconds to ticks
			var secondsToTicks = function(seconds) {
				return Math.round(seconds * 254016000000);
			};

			var targetTime = new Time();
			targetTime.ticks = secondsToTicks(timeInSeconds).toString();

			// Set the current time indicator (CTI) to the target time
			targetSequence.setPlayerPosition(targetTime.ticks);

			$._PPP_.updateEventPanel('Navigated to ' + timeInSeconds.toFixed(2) + 's in sequence: ' + targetSequence.name);

			return {
				success: true,
				message: "Navigated to " + timeInSeconds.toFixed(2) + "s"
			};

		} catch (e) {
			$.writeln("[navigateToTime] Error: " + e);
			return {
				success: false,
				message: "Error: " + e.toString()
			};
		}
	},

	/**
	 * navigateActiveSequenceToTime: Navigate to a specific time in the active sequence
	 * @param {number} timeInSeconds - Time in seconds to navigate to
	 * @returns {object} Result with success status
	 */
	navigateActiveSequenceToTime: function(timeInSeconds) {
		try {
			if (!app.project) {
				return {
					success: false,
					message: "No project open"
				};
			}

			var activeSeq = app.project.activeSequence;
			if (!activeSeq) {
				return {
					success: false,
					message: "No active sequence"
				};
			}

			// Convert seconds to ticks (254016000000 ticks per second)
			var secondsToTicks = function(seconds) {
				return Math.round(seconds * 254016000000);
			};

			var targetTime = new Time();
			targetTime.ticks = secondsToTicks(timeInSeconds).toString();

			// Set the current time indicator (CTI) to the target time
			activeSeq.setPlayerPosition(targetTime.ticks);

			return {
				success: true,
				sequenceName: activeSeq.name,
				timeSeconds: timeInSeconds
			};

		} catch (e) {
			$.writeln("[navigateActiveSequenceToTime] Error: " + e);
			return {
				success: false,
				message: "Error: " + e.toString()
			};
		}
	},

	/**
	 * applyCutsToSequence: Apply NG cut results by creating a new sequence with good cuts only
	 * @param {string} sequenceId - Sequence ID
	 * @param {Array} cuts - Array of cut objects with {start, end, score, isGood}
	 * @returns {object} Result with success status and message
	 */
	applySBDCutsToSequence: function(sequenceId, scenes) {
		try {
			$.writeln("[applySBDCutsToSequence] Starting...");

			// Create log file on Desktop for debugging
			var logFile = new File("~/Desktop/sbd_cuts_log.txt");
			logFile.open("w");
			logFile.writeln("=== SBD Cuts Log ===");
			logFile.writeln("Timestamp: " + new Date().toString());
			logFile.writeln("");

			if (!app.project) {
				logFile.writeln("ERROR: No project open");
				logFile.close();
				return {
					success: false,
					message: "No project open"
				};
			}

			// Parse sequence index
			var seqIndex = parseInt(sequenceId);
			$.writeln("[applySBDCutsToSequence] Sequence index: " + seqIndex);
			logFile.writeln("Sequence index: " + seqIndex);

			if (isNaN(seqIndex) || seqIndex < 0 || seqIndex >= app.project.sequences.numSequences) {
				logFile.writeln("ERROR: Invalid sequence ID: " + sequenceId);
				logFile.close();
				return {
					success: false,
					message: "Invalid sequence ID: " + sequenceId
				};
			}

			var targetSequence = app.project.sequences[seqIndex];
			if (!targetSequence) {
				logFile.writeln("ERROR: Sequence not found");
				logFile.close();
				return {
					success: false,
					message: "Sequence not found"
				};
			}
			$.writeln("[applySBDCutsToSequence] Target sequence: " + targetSequence.name);
			logFile.writeln("Target sequence: " + targetSequence.name);

			// Parse scenes array if it's a string
			var scenesArray = typeof scenes === 'string' ? JSON.parse(scenes) : scenes;

			if (!scenesArray || !scenesArray.length) {
				return {
					success: false,
					message: "No scenes provided"
				};
			}
			$.writeln("[applySBDCutsToSequence] Total scenes: " + scenesArray.length);

			// Helper function to convert seconds to ticks
			var secondsToTicks = function(seconds) {
				return Math.round(seconds * 254016000000);
			};

			$._PPP_.updateEventPanel('Cutting sequence at scene boundaries...');

			// Make the target sequence active
			app.project.activeSequence = targetSequence;

			// Enable QE DOM - required for razor functionality
			logFile.writeln("\n=== Enabling QE DOM ===");
			if (typeof qe === 'undefined') {
				$.writeln("Enabling QE...");
				logFile.writeln("Enabling QE...");
				app.enableQE();
			}

			// Verify QE is available
			if (typeof qe === 'undefined' || !qe || !qe.project) {
				logFile.writeln("ERROR: QE not available after enableQE()");
				logFile.close();
				return {
					success: false,
					message: "QE (QuickEdit) API not available. Cannot cut sequence."
				};
			}

			logFile.writeln("QE enabled successfully");

			// Get QE sequence
			var qeSequence = qe.project.getActiveSequence();
			if (!qeSequence) {
				logFile.writeln("ERROR: Could not get QE active sequence");
				logFile.close();
				return {
					success: false,
					message: "Could not get QE sequence"
				};
			}

			logFile.writeln("QE sequence obtained: " + qeSequence);

			// Collect all scene boundaries (no need for start at 0.0)
			var allBoundaries = [];
			for (var i = 0; i < scenesArray.length; i++) {
				var scene = scenesArray[i];
				$.writeln("  Scene " + (i + 1) + ": start=" + scene.start + "s, end=" + scene.end + "s");

				// Add start boundary if it's not at 0
				if (scene.start > 0.01) { // Small threshold to avoid cutting at exact 0
					allBoundaries.push(scene.start);
				}

				// Add end boundary (skip if it's at the very end of sequence)
				var seqDuration = parseInt(targetSequence.end) / 254016000000;
				if (Math.abs(scene.end - seqDuration) > 0.1) {
					allBoundaries.push(scene.end);
				}
			}

			// Sort boundaries by time
			allBoundaries.sort(function(a, b) {
				return a - b;
			});

			// Remove duplicate times
			var uniqueTimes = [];
			var lastTime = -1;
			for (var i = 0; i < allBoundaries.length; i++) {
				// Skip if it's the same as the last time (with small tolerance for floating point)
				if (Math.abs(allBoundaries[i] - lastTime) > 0.001) {
					uniqueTimes.push(allBoundaries[i]);
					lastTime = allBoundaries[i];
				}
			}

			$.writeln("[applySBDCutsToSequence] Unique cut times: " + uniqueTimes.length);
			for (var i = 0; i < Math.min(10, uniqueTimes.length); i++) {
				$.writeln("  Cut " + (i + 1) + ": " + uniqueTimes[i] + "s");
			}
			if (uniqueTimes.length > 10) {
				$.writeln("  ... and " + (uniqueTimes.length - 10) + " more");
			}

			$._PPP_.updateEventPanel('Making ' + uniqueTimes.length + ' cuts at scene boundaries...');

			// Make cuts using QE DOM API
			var successfulCuts = 0;
			var failedCuts = 0;

			// Process cuts - use QE API which is the only reliable way
			logFile.writeln("\n=== Starting Razor Cuts with QE DOM ===");
			logFile.writeln("Total unique cut times: " + uniqueTimes.length);

			for (var i = 0; i < uniqueTimes.length; i++) {
				var cutTimeSeconds = uniqueTimes[i];
				logFile.writeln("\n--- Cut #" + (i + 1) + " ---");
				logFile.writeln("Time in seconds: " + cutTimeSeconds);

				try {
					$.writeln("  Making cut at " + cutTimeSeconds + "s");

					// Calculate ticks
					var cutTimeTicks = secondsToTicks(cutTimeSeconds);
					logFile.writeln("Ticks value: " + cutTimeTicks);

					var tracksRazored = 0;
					var tracksFailed = 0;

					// Move CTI to the cut position FIRST
					targetSequence.setPlayerPosition(cutTimeTicks.toString());
					logFile.writeln("CTI moved to ticks: " + cutTimeTicks);

					// Now razor each track at CTI position (no parameters!)
					var numVideoTracks = qeSequence.numVideoTracks;
					logFile.writeln("Number of video tracks: " + numVideoTracks);

					// Razor all video tracks using ticksString method
					var ticksString = cutTimeTicks.toString();
					logFile.writeln("Using ticks string: " + ticksString);

					for (var vti = 0; vti < numVideoTracks; vti++) {
						try {
							var videoTrack = qeSequence.getVideoTrackAt(vti);
							$.writeln("      Razoring video track " + vti);
							logFile.writeln("  Razoring video track " + vti);

							// Use ticksString - confirmed working from tests
							videoTrack.razor(ticksString);

							tracksRazored++;
							$.writeln("      Video track " + vti + " SUCCESS");
							logFile.writeln("  Video track " + vti + " razored successfully");
						} catch (vErr) {
							tracksFailed++;
							$.writeln("      Video track " + vti + " FAILED: " + vErr.message);
							logFile.writeln("  ERROR razoring video track " + vti + ": " + vErr.toString());
						}
					}

					// Razor all audio tracks
					var numAudioTracks = qeSequence.numAudioTracks;
					logFile.writeln("Number of audio tracks: " + numAudioTracks);

					for (var ati = 0; ati < numAudioTracks; ati++) {
						try {
							var audioTrack = qeSequence.getAudioTrackAt(ati);
							$.writeln("      Razoring audio track " + ati);
							logFile.writeln("  Razoring audio track " + ati);

							// Use ticksString - confirmed working from tests
							audioTrack.razor(ticksString);

							tracksRazored++;
							$.writeln("      Audio track " + ati + " SUCCESS");
							logFile.writeln("  Audio track " + ati + " razored successfully");
						} catch (aErr) {
							tracksFailed++;
							$.writeln("      Audio track " + ati + " FAILED: " + aErr.message);
							logFile.writeln("  ERROR razoring audio track " + ati + ": " + aErr.toString());
						}
					}

					logFile.writeln("\nTracks razored: " + tracksRazored + ", failed: " + tracksFailed);

					$.writeln("    Cut result: " + (tracksRazored > 0 ? "SUCCESS" : "FAILED"));
					logFile.writeln("\nCut result: " + (tracksRazored > 0 ? "SUCCESS" : "FAILED"));

					if (tracksRazored > 0) {
						successfulCuts++;
						logFile.writeln("Status: SUCCESS");
					} else {
						failedCuts++;
						logFile.writeln("Status: FAILED");
					}

					// Update progress every 10 cuts
					if ((i + 1) % 10 === 0) {
						$._PPP_.updateEventPanel('Cutting at scene boundaries... (' + (i + 1) + '/' + uniqueTimes.length + ')');
					}
				} catch (razorErr) {
					failedCuts++;
					$.writeln("    ERROR cutting at " + cutTimeSeconds + "s:");
					$.writeln("    Error type: " + razorErr.name);
					$.writeln("    Error message: " + razorErr.message);
					$.writeln("    Error string: " + razorErr.toString());

					logFile.writeln("Status: FAILED");
					logFile.writeln("Error type: " + razorErr.name);
					logFile.writeln("Error message: " + razorErr.message);
					logFile.writeln("Error details: " + razorErr.toString());
					if (razorErr.line) {
						logFile.writeln("Error line: " + razorErr.line);
					}
				}
			}

			$.writeln("[applySBDCutsToSequence] Razor cuts completed");
			$.writeln("  Successful cuts: " + successfulCuts);
			$.writeln("  Failed cuts: " + failedCuts);

			logFile.writeln("\n=== Summary ===");
			logFile.writeln("Successful cuts: " + successfulCuts);
			logFile.writeln("Failed cuts: " + failedCuts);

			// Create a new sequence with cuts applied
			logFile.writeln("\n=== Creating New Sequence with Cuts ===");
			$.writeln("[applySBDCutsToSequence] Creating new sequence with cuts...");

			// Generate new sequence name
			var now = new Date();
			var dateStr = now.getFullYear() +
				("0" + (now.getMonth() + 1)).slice(-2) +
				("0" + now.getDate()).slice(-2) + "_" +
				("0" + now.getHours()).slice(-2) +
				("0" + now.getMinutes()).slice(-2) +
				("0" + now.getSeconds()).slice(-2);
			var newSequenceName = "SBD_" + targetSequence.name + "_" + dateStr;

			logFile.writeln("New sequence name: " + newSequenceName);

			// Clone the sequence
			app.project.activeSequence = targetSequence;
			var cloneResult = targetSequence.clone();

			if (!cloneResult) {
				logFile.writeln("ERROR: Failed to clone sequence");
				logFile.close();
				return {
					success: false,
					message: "Failed to clone sequence"
				};
			}

			// Get the newly cloned sequence (it's the last one)
			var newSequence = app.project.sequences[app.project.sequences.numSequences - 1];
			newSequence.name = newSequenceName;

			logFile.writeln("Sequence cloned successfully: " + newSequence.name);

			// Now apply razor cuts to the new sequence using QE
			app.project.activeSequence = newSequence;
			var qeNewSequence = qe.project.getActiveSequence();

			if (!qeNewSequence) {
				logFile.writeln("ERROR: Could not get QE sequence for new sequence");
				logFile.close();
				return {
					success: false,
					message: "Could not get QE sequence"
				};
			}

			// MANUAL CLIP SPLITTING APPROACH
			// Since razor APIs don't work, we need to manually split clips
			logFile.writeln("\n=== Manual Clip Splitting ===");
			logFile.writeln("This will create a NEW sequence with clips split at cut points");

			// Create a brand new empty sequence with same settings
			var settingsClone = newSequence.getSettings();
			var finalSequenceName = "SBD_CUT_" + targetSequence.name + "_" + dateStr;

			logFile.writeln("\nCreating new empty sequence: " + finalSequenceName);

			// Create new sequence based on the cloned sequence's ID
			var finalSequence = app.project.createNewSequence(finalSequenceName, newSequence.sequenceID);

			if (!finalSequence) {
				logFile.writeln("ERROR: Failed to create new sequence");
				logFile.close();
				return {
					success: false,
					message: "Failed to create new sequence"
				};
			}

			logFile.writeln("New sequence created successfully");

			var totalClipsCreated = 0;
			var totalCutsApplied = 0;

			// Helper function to find all cut points within a time range
			var findCutsInRange = function(startSec, endSec) {
				var cutsInRange = [];
				for (var i = 0; i < uniqueTimes.length; i++) {
					var cutTime = uniqueTimes[i];
					// Cut point must be strictly within the clip (not at boundaries)
					if (cutTime > startSec + 0.001 && cutTime < endSec - 0.001) {
						cutsInRange.push(cutTime);
					}
				}
				return cutsInRange;
			};

			// Process VIDEO tracks
			logFile.writeln("\n=== Processing Video Tracks ===");
			$._PPP_.updateEventPanel('Splitting video clips at scene boundaries...');

			for (var vTrackIdx = 0; vTrackIdx < newSequence.videoTracks.numTracks; vTrackIdx++) {
				var sourceVTrack = newSequence.videoTracks[vTrackIdx];
				var targetVTrack = finalSequence.videoTracks[vTrackIdx];

				logFile.writeln("\nVideo Track " + vTrackIdx + ": " + sourceVTrack.clips.numItems + " clips");

				for (var vClipIdx = 0; vClipIdx < sourceVTrack.clips.numItems; vClipIdx++) {
					// Update progress every clip
					if (vClipIdx % 5 === 0) {
						$._PPP_.updateEventPanel('Processing video track ' + vTrackIdx + ' clip ' + (vClipIdx + 1) + '/' + sourceVTrack.clips.numItems);
					}
					var clip = sourceVTrack.clips[vClipIdx];

					var clipStartSec = parseInt(clip.start.ticks) / 254016000000;
					var clipEndSec = parseInt(clip.end.ticks) / 254016000000;
					var clipInSec = parseInt(clip.inPoint.ticks) / 254016000000;
					var clipOutSec = parseInt(clip.outPoint.ticks) / 254016000000;

					logFile.writeln("  Clip " + vClipIdx + ": seq[" + clipStartSec.toFixed(2) + "~" + clipEndSec.toFixed(2) + "] src[" + clipInSec.toFixed(2) + "~" + clipOutSec.toFixed(2) + "]");

					// Find all cut points within this clip
					var cutsInClip = findCutsInRange(clipStartSec, clipEndSec);

					if (cutsInClip.length === 0) {
						// No cuts in this clip - overwrite at exact position
						logFile.writeln("    No cuts - overwriting whole clip");
						try {
							targetVTrack.overwriteClip(clip.projectItem, clipStartSec);

							// Set in/out points on the newly inserted clip
							var insertedClip = targetVTrack.clips[targetVTrack.clips.numItems - 1];
							if (insertedClip) {
								insertedClip.inPoint = clip.inPoint;
								insertedClip.outPoint = clip.outPoint;
							}
							totalClipsCreated++;
						} catch (insertErr) {
							logFile.writeln("    ERROR inserting clip: " + insertErr.toString());
						}
					} else {
						// Clip has cuts - split it into segments
						logFile.writeln("    " + cutsInClip.length + " cuts found, splitting into " + (cutsInClip.length + 1) + " segments");

						// Sort cuts within this clip
						cutsInClip.sort(function(a, b) { return a - b; });

						// Create segments
						var segments = [];
						var prevCut = clipStartSec;

						for (var cutIdx = 0; cutIdx < cutsInClip.length; cutIdx++) {
							var cutPoint = cutsInClip[cutIdx];
							segments.push({
								seqStart: prevCut,
								seqEnd: cutPoint
							});
							prevCut = cutPoint;
						}
						// Last segment
						segments.push({
							seqStart: prevCut,
							seqEnd: clipEndSec
						});

						// Overwrite each segment at exact timeline position
						for (var segIdx = 0; segIdx < segments.length; segIdx++) {
							var seg = segments[segIdx];
							var segDuration = seg.seqEnd - seg.seqStart;
							var offsetInOriginalClip = seg.seqStart - clipStartSec;
							var segInSec = clipInSec + offsetInOriginalClip;
							var segOutSec = segInSec + segDuration;

							logFile.writeln("      Segment " + segIdx + ": seq[" + seg.seqStart.toFixed(2) + "~" + seg.seqEnd.toFixed(2) + "] src[" + segInSec.toFixed(2) + "~" + segOutSec.toFixed(2) + "]");

							try {
								targetVTrack.overwriteClip(clip.projectItem, seg.seqStart);

								// Set in/out points for this segment
								var insertedSeg = targetVTrack.clips[targetVTrack.clips.numItems - 1];
								if (insertedSeg) {
									var inTime = new Time();
									inTime.seconds = segInSec;
									var outTime = new Time();
									outTime.seconds = segOutSec;

									insertedSeg.inPoint = inTime;
									insertedSeg.outPoint = outTime;
								}
								totalClipsCreated++;
								totalCutsApplied++;
							} catch (segErr) {
								logFile.writeln("      ERROR inserting segment: " + segErr.toString());
							}
						}
					}
				}
			}

			// Process AUDIO tracks
			logFile.writeln("\n=== Processing Audio Tracks ===");
			$._PPP_.updateEventPanel('Splitting audio clips at scene boundaries...');

			for (var aTrackIdx = 0; aTrackIdx < newSequence.audioTracks.numTracks; aTrackIdx++) {
				var sourceATrack = newSequence.audioTracks[aTrackIdx];
				var targetATrack = finalSequence.audioTracks[aTrackIdx];

				logFile.writeln("\nAudio Track " + aTrackIdx + ": " + sourceATrack.clips.numItems + " clips");

				for (var aClipIdx = 0; aClipIdx < sourceATrack.clips.numItems; aClipIdx++) {
					var aClip = sourceATrack.clips[aClipIdx];

					var aClipStartSec = parseInt(aClip.start.ticks) / 254016000000;
					var aClipEndSec = parseInt(aClip.end.ticks) / 254016000000;
					var aClipInSec = parseInt(aClip.inPoint.ticks) / 254016000000;
					var aClipOutSec = parseInt(aClip.outPoint.ticks) / 254016000000;

					// Find all cut points within this clip
					var aCutsInClip = findCutsInRange(aClipStartSec, aClipEndSec);

					if (aCutsInClip.length === 0) {
						// No cuts - overwrite at exact position
						try {
							targetATrack.overwriteClip(aClip.projectItem, aClipStartSec);
							var insertedAClip = targetATrack.clips[targetATrack.clips.numItems - 1];
							if (insertedAClip) {
								insertedAClip.inPoint = aClip.inPoint;
								insertedAClip.outPoint = aClip.outPoint;
							}
						} catch (aInsertErr) {
							logFile.writeln("    ERROR overwriting audio clip: " + aInsertErr.toString());
						}
					} else {
						// Split audio clip
						aCutsInClip.sort(function(a, b) { return a - b; });

						var aSegments = [];
						var aPrevCut = aClipStartSec;
						for (var aCutIdx = 0; aCutIdx < aCutsInClip.length; aCutIdx++) {
							aSegments.push({ seqStart: aPrevCut, seqEnd: aCutsInClip[aCutIdx] });
							aPrevCut = aCutsInClip[aCutIdx];
						}
						aSegments.push({ seqStart: aPrevCut, seqEnd: aClipEndSec });

						for (var aSegIdx = 0; aSegIdx < aSegments.length; aSegIdx++) {
							var aSeg = aSegments[aSegIdx];
							var aSegDuration = aSeg.seqEnd - aSeg.seqStart;
							var aOffsetInOriginalClip = aSeg.seqStart - aClipStartSec;
							var aSegInSec = aClipInSec + aOffsetInOriginalClip;
							var aSegOutSec = aSegInSec + aSegDuration;

							try {
								targetATrack.overwriteClip(aClip.projectItem, aSeg.seqStart);
								var insertedASeg = targetATrack.clips[targetATrack.clips.numItems - 1];
								if (insertedASeg) {
									var aInTime = new Time();
									aInTime.seconds = aSegInSec;
									var aOutTime = new Time();
									aOutTime.seconds = aSegOutSec;
									insertedASeg.inPoint = aInTime;
									insertedASeg.outPoint = aOutTime;
								}
							} catch (aSegErr) {
								logFile.writeln("    ERROR overwriting audio segment: " + aSegErr.toString());
							}
						}
					}
				}
			}

			var clipsAfter = finalSequence.videoTracks[0].clips.numItems;
			logFile.writeln("\n=== Summary ===");
			logFile.writeln("Total clips created: " + totalClipsCreated);
			logFile.writeln("Total cuts applied: " + totalCutsApplied);
			logFile.writeln("Clips in final video track 0: " + clipsAfter);

			// Make the new sequence active so user can see it
			app.project.activeSequence = finalSequence;

			var resultMessage = "✅ Scene boundaries applied successfully!\n\n" +
				"New sequence: " + finalSequenceName + "\n" +
				"Original: " + targetSequence.name + "\n\n" +
				"📊 Results:\n" +
				"- Scenes detected: " + scenesArray.length + "\n" +
				"- Cut points: " + uniqueTimes.length + "\n" +
				"- Clips created: " + totalClipsCreated + "\n" +
				"- Cuts applied: " + totalCutsApplied + "\n\n" +
				"The new sequence '" + finalSequenceName + "' is now active.\n" +
				"Check your timeline - clips should be split at scene boundaries!";

			logFile.writeln("\nResult message: " + resultMessage);
			logFile.writeln("\nLog file saved to: ~/Desktop/sbd_cuts_log.txt");
			logFile.close();

			$._PPP_.updateEventPanel('Sequence created with ' + totalClipsCreated + ' clips (' + totalCutsApplied + ' cuts applied)');

			return {
				success: true,
				message: resultMessage,
				sequenceName: finalSequenceName,
				totalScenes: scenesArray.length,
				totalCutPoints: uniqueTimes.length,
				totalClipsCreated: totalClipsCreated,
				cutsApplied: totalCutsApplied,
				clipsAfter: clipsAfter
			};

		} catch (e) {
			$.writeln("[applySBDCutsToSequence] Error: " + e.toString());
			$.writeln("[applySBDCutsToSequence] Line: " + e.line);

			try {
				if (logFile) {
					logFile.writeln("\n=== FATAL ERROR ===");
					logFile.writeln("Error: " + e.toString());
					logFile.writeln("Line: " + e.line);
					logFile.close();
				}
			} catch (logErr) {
				// Ignore log file errors
			}

			return {
				success: false,
				message: "Error applying SBD cuts: " + e.toString() + " (line: " + e.line + ")"
			};
		}
	},

	applyCutsToSequence: function(sequenceId, cuts) {
		try {
			$.writeln("[applyCutsToSequence] Starting...");

			if (!app.project) {
				return {
					success: false,
					message: "No project open"
				};
			}

			// Parse sequence index
			var seqIndex = parseInt(sequenceId);
			$.writeln("[applyCutsToSequence] Sequence index: " + seqIndex);

			if (isNaN(seqIndex) || seqIndex < 0 || seqIndex >= app.project.sequences.numSequences) {
				return {
					success: false,
					message: "Invalid sequence ID: " + sequenceId
				};
			}

			var sourceSequence = app.project.sequences[seqIndex];
			if (!sourceSequence) {
				return {
					success: false,
					message: "Sequence not found"
				};
			}
			$.writeln("[applyCutsToSequence] Source sequence: " + sourceSequence.name);

			// Parse cuts array if it's a string
			var cutsArray = typeof cuts === 'string' ? JSON.parse(cuts) : cuts;

			if (!cutsArray || !cutsArray.length) {
				return {
					success: false,
					message: "No cuts provided"
				};
			}
			$.writeln("[applyCutsToSequence] Total cuts: " + cutsArray.length);

			// Filter good cuts and bad cuts
			var goodCuts = [];
			var badCuts = [];
			for (var i = 0; i < cutsArray.length; i++) {
				if (cutsArray[i].isGood) {
					goodCuts.push(cutsArray[i]);
				} else {
					badCuts.push(cutsArray[i]);
				}
			}
			$.writeln("[applyCutsToSequence] Good cuts: " + goodCuts.length + ", Bad cuts: " + badCuts.length);

			// DEBUG: Show good/bad cuts info
			if (goodCuts.length > 0) {
				$.writeln("Good cuts:");
				for (var gi = 0; gi < Math.min(5, goodCuts.length); gi++) {
					$.writeln("  " + gi + ": " + goodCuts[gi].start + "s - " + goodCuts[gi].end + "s");
				}
			}
			if (badCuts.length > 0) {
				$.writeln("Bad cuts:");
				for (var bi = 0; bi < Math.min(5, badCuts.length); bi++) {
					$.writeln("  " + bi + ": " + badCuts[bi].start + "s - " + badCuts[bi].end + "s");
				}
			}

			if (goodCuts.length === 0 && badCuts.length === 0) {
				return {
					success: false,
					message: "No cuts to apply"
				};
			}

			// Sort cuts by start time
			if (goodCuts.length > 0) {
				goodCuts.sort(function(a, b) {
					return a.start - b.start;
				});
			}
			if (badCuts.length > 0) {
				badCuts.sort(function(a, b) {
					return a.start - b.start;
				});
			}

			// Helper function to convert seconds to ticks
			var secondsToTicks = function(seconds) {
				return Math.round(seconds * 254016000000);
			};

			// Generate new sequence name: NGCUT_{originalName}_{YYYYMMDD_HHMMSS}
			var now = new Date();
			var dateStr = now.getFullYear() +
				("0" + (now.getMonth() + 1)).slice(-2) +
				("0" + now.getDate()).slice(-2) + "_" +
				("0" + now.getHours()).slice(-2) +
				("0" + now.getMinutes()).slice(-2) +
				("0" + now.getSeconds()).slice(-2);
			var newSequenceName = "NGCUT_" + sourceSequence.name + "_" + dateStr;

			$._PPP_.updateEventPanel('Duplicating sequence: ' + newSequenceName);

			$.writeln("[applyCutsToSequence] Duplicating source sequence...");

			// Make the source sequence active first
			app.project.activeSequence = sourceSequence;

			// Duplicate the sequence using Premiere Pro's built-in duplicate function
			// This is the most reliable way to copy a sequence with all its contents
			var duplicateCommand = app.project.activeSequence.clone();

			if (!duplicateCommand) {
				$.writeln("[applyCutsToSequence] Clone failed, trying alternative method...");

				// Alternative: Use sequence import/export
				// Create new sequence and manually copy
				var newSequence = app.project.createNewSequence(newSequenceName, sourceSequence.sequenceID);

				// Copy all project items that are in the source sequence
				for (var vTrackIdx = 0; vTrackIdx < sourceSequence.videoTracks.numTracks; vTrackIdx++) {
					var vTrack = sourceSequence.videoTracks[vTrackIdx];
					for (var vClipIdx = 0; vClipIdx < vTrack.clips.numItems; vClipIdx++) {
						var vClip = vTrack.clips[vClipIdx];
						try {
							newSequence.videoTracks[vTrackIdx].insertClip(
								vClip.projectItem,
								vClip.start.ticks
							);
						} catch (e) {
							$.writeln("Error copying video clip: " + e);
						}
					}
				}

				for (var aTrackIdx = 0; aTrackIdx < sourceSequence.audioTracks.numTracks; aTrackIdx++) {
					var aTrack = sourceSequence.audioTracks[aTrackIdx];
					for (var aClipIdx = 0; aClipIdx < aTrack.clips.numItems; aClipIdx++) {
						var aClip = aTrack.clips[aClipIdx];
						try {
							newSequence.audioTracks[aTrackIdx].insertClip(
								aClip.projectItem,
								aClip.start.ticks
							);
						} catch (e) {
							$.writeln("Error copying audio clip: " + e);
						}
					}
				}
			} else {
				// Clone succeeded, get the duplicated sequence
				var newSequence = app.project.sequences[app.project.sequences.numSequences - 1];
			}

			if (!newSequence) {
				return {
					success: false,
					message: "Failed to duplicate sequence"
				};
			}

			// Rename the duplicated sequence
			newSequence.name = newSequenceName;

			$.writeln("[applyCutsToSequence] Sequence duplicated. New sequence has " + newSequence.videoTracks[0].clips.numItems + " video clips");

			var clipsCopied = newSequence.videoTracks[0].clips.numItems;

			// Collect all cut boundaries (both good and bad)
			var allBoundaries = [];
			for (var i = 0; i < cutsArray.length; i++) {
				var cut = cutsArray[i];
				$.writeln("  Cut " + i + ": start=" + cut.start + "s, end=" + cut.end + "s, isGood=" + cut.isGood);
				allBoundaries.push({ time: cut.start });
				allBoundaries.push({ time: cut.end });
			}

			// Sort boundaries by time
			allBoundaries.sort(function(a, b) {
				return a.time - b.time;
			});

			// Remove duplicate times
			var uniqueTimes = [];
			var lastTime = -1;
			for (var i = 0; i < allBoundaries.length; i++) {
				if (allBoundaries[i].time !== lastTime) {
					uniqueTimes.push(allBoundaries[i].time);
					lastTime = allBoundaries[i].time;
				}
			}

			$.writeln("[applyCutsToSequence] Unique razor times: " + uniqueTimes.length);
			$._PPP_.updateEventPanel('Making ' + uniqueTimes.length + ' razor cuts in new sequence...');

			// Make all razor cuts in the new sequence
			for (var i = 0; i < uniqueTimes.length; i++) {
				var cutTime = new Time();
				cutTime.ticks = secondsToTicks(uniqueTimes[i]).toString();

				try {
					$.writeln("  Razor at " + uniqueTimes[i] + "s (ticks: " + cutTime.ticks + ")");
					newSequence.razorAt(cutTime.ticks);
					if (i % 10 === 0) {
						$._PPP_.updateEventPanel('Cutting at ' + uniqueTimes[i].toFixed(1) + 's (' + (i + 1) + '/' + uniqueTimes.length + ')');
					}
				} catch (razorErr) {
					$.writeln("Error cutting at " + uniqueTimes[i] + "s: " + razorErr);
				}
			}

			$.writeln("[applyCutsToSequence] All razor cuts completed");
			$._PPP_.updateEventPanel('All cuts made. Now classifying and processing clips...');

			// Helper function to check if a time is within a good cut
			var isTimeInGoodCut = function(time) {
				for (var i = 0; i < goodCuts.length; i++) {
					if (time >= goodCuts[i].start && time < goodCuts[i].end) {
						return true;
					}
				}
				return false;
			};

			// Helper function to check if a time is within a bad cut
			var isTimeInBadCut = function(time) {
				for (var i = 0; i < badCuts.length; i++) {
					if (time >= badCuts[i].start && time < badCuts[i].end) {
						return true;
					}
				}
				return false;
			};

			var goodSegments = 0;
			var badSegments = 0;

			$.writeln("[applyCutsToSequence] Starting to process clips in " + newSequence.videoTracks.numTracks + " video tracks");

			// Process all clips in all video tracks
			for (var trackIdx = newSequence.videoTracks.numTracks - 1; trackIdx >= 0; trackIdx--) {
				var track = newSequence.videoTracks[trackIdx];
				$.writeln("  Track " + trackIdx + " has " + track.clips.numItems + " clips");

				for (var clipIdx = track.clips.numItems - 1; clipIdx >= 0; clipIdx--) {
					var clip = track.clips[clipIdx];

					var clipStartSec = parseInt(clip.start.ticks) / 254016000000;
					var clipEndSec = parseInt(clip.end.ticks) / 254016000000;
					var clipMidpoint = (clipStartSec + clipEndSec) / 2;

					$.writeln("    Clip " + clipIdx + ": " + clipStartSec.toFixed(2) + "s - " + clipEndSec.toFixed(2) + "s (mid: " + clipMidpoint.toFixed(2) + "s)");

					// Check if the midpoint of this clip is in a good cut region
					if (isTimeInGoodCut(clipMidpoint)) {
						// This is a good clip - mark it green
						$.writeln("      -> GOOD cut, marking green");
						try {
							clip.setColorLabel(5); // Green (KEEP)
							goodSegments++;
							$.writeln("      -> Successfully colored green");
						} catch (colorErr) {
							$.writeln("      -> Error coloring clip: " + colorErr);
						}
					} else if (isTimeInBadCut(clipMidpoint)) {
						// This is a bad clip - mark it red
						$.writeln("      -> BAD cut, marking red");
						try {
							clip.setColorLabel(13); // Red (DROP)
							badSegments++;
							$.writeln("      -> Successfully colored red");
						} catch (colorErr) {
							$.writeln("      -> Error coloring clip: " + colorErr);
						}
					} else {
						$.writeln("      -> Unclassified, keeping as is");
					}
				}
			}

			$.writeln("[applyCutsToSequence] Video processing complete: good=" + goodSegments + ", bad=" + badSegments);

			// Process all clips in all audio tracks
			for (var aTrackIdx = newSequence.audioTracks.numTracks - 1; aTrackIdx >= 0; aTrackIdx--) {
				var aTrack = newSequence.audioTracks[aTrackIdx];

				for (var aClipIdx = aTrack.clips.numItems - 1; aClipIdx >= 0; aClipIdx--) {
					var aClip = aTrack.clips[aClipIdx];

					var aClipStartSec = parseInt(aClip.start.ticks) / 254016000000;
					var aClipEndSec = parseInt(aClip.end.ticks) / 254016000000;
					var aClipMidpoint = (aClipStartSec + aClipEndSec) / 2;

					if (isTimeInGoodCut(aClipMidpoint)) {
						try {
							aClip.setColorLabel(5); // Green (KEEP)
						} catch (aColorErr) {
							$.writeln("Error coloring audio clip: " + aColorErr);
						}
					} else if (isTimeInBadCut(aClipMidpoint)) {
						try {
							aClip.setColorLabel(13); // Red (DROP)
						} catch (aColorErr) {
							$.writeln("Error coloring audio clip: " + aColorErr);
						}
					}
					// else: clip is not in any cut region - keep it as is
				}
			}

			// Set the new sequence as active
			app.project.activeSequence = newSequence;

			$._PPP_.updateEventPanel('Done! Created new sequence with ' + goodSegments + ' good clips (green) and ' + badSegments + ' bad clips (red)');

			var debugInfo = "DEBUG INFO:\n" +
				"- Good cuts count: " + goodCuts.length + "\n" +
				"- Bad cuts count: " + badCuts.length + "\n" +
				"- Clips copied: " + clipsCopied + "\n" +
				"- Unique razor times: " + uniqueTimes.length + "\n" +
				"- Good segments (green): " + goodSegments + "\n" +
				"- Bad segments (red): " + badSegments;

			$.writeln(debugInfo);

			return {
				success: true,
				message: "Successfully created new sequence '" + newSequenceName + "'.\n\n- " + goodSegments + " good clips marked GREEN (KEEP)\n- " + badSegments + " bad clips marked RED (DROP)\n- Other clips kept as is\n\n" + debugInfo,
				goodCutsCount: goodCuts.length,
				badCutsCount: badCuts.length,
				goodSegments: goodSegments,
				badSegments: badSegments,
				clipsCopied: clipsCopied,
				razorCuts: uniqueTimes.length,
				newSequenceName: newSequenceName
			};

		} catch (e) {
			$.writeln("[applyCutsToSequence] Error: " + e);
			$.writeln("[applyCutsToSequence] Error stack: " + e.stack);
			$.writeln("[applyCutsToSequence] Error line: " + e.line);
			$._PPP_.updateEventPanel('Error applying cuts: ' + e.toString());
			return {
				success: false,
				message: "Error: " + e.toString() + (e.line ? " (line: " + e.line + ")" : "")
			};
		}
	},

	/**
	 * razorActiveSequenceAtSceneBoundaries: Apply razor cuts to active sequence at scene boundaries
	 * v5: Adds options parameter for conditional features and new sequence creation
	 * @param {Array} scenes - Array of scene objects with {startSec, endSec, classification?, selectedTrack?}
	 * @param {Object} options - Options object with {applyLabels?, disableNonSelected?, createNewSequence?}
	 * @returns {object} Result with success status and message
	 */
	razorActiveSequenceAtSceneBoundaries: function(scenes, options) {
		try {
			$.writeln("[razorActiveSequenceAtSceneBoundaries] Starting...");

			// Create log file on Desktop for debugging
			var logFile = new File("~/Desktop/razor_cuts_log.txt");
			logFile.open("w");
			logFile.writeln("=== Razor Cuts Log (v5 - Options Support) ===");
			logFile.writeln("Timestamp: " + new Date().toString());
			logFile.writeln("");

			// Parse options
			var opts = typeof options === 'string' ? JSON.parse(options) : (options || {});
			var applyLabels = opts.applyLabels !== false; // Default true
			var disableNonSelected = opts.disableNonSelected !== false; // Default true
			var createNewSequence = opts.createNewSequence === true; // Default false
			var newSequenceName = opts.newSequenceName || null; // Custom name for new sequence

			logFile.writeln("Options:");
			logFile.writeln("  applyLabels: " + applyLabels);
			logFile.writeln("  disableNonSelected: " + disableNonSelected);
			logFile.writeln("  createNewSequence: " + createNewSequence);
			logFile.writeln("  newSequenceName: " + newSequenceName);
			logFile.writeln("");

			if (!app.project) {
				logFile.writeln("ERROR: No project open");
				logFile.close();
				return { success: false, message: "No project open" };
			}

			var sourceSequence = app.project.activeSequence;
			if (!sourceSequence) {
				logFile.writeln("ERROR: No active sequence");
				logFile.close();
				return { success: false, message: "No active sequence" };
			}

			var targetSequence = sourceSequence;
			var newSequenceCreatedActual = false;

			// If createNewSequence is true, duplicate the sequence using clone()
			if (createNewSequence) {
				logFile.writeln("Creating new sequence from: " + sourceSequence.name);

				try {
					// Collect existing sequence IDs before clone
					var existingSeqIds = {};
					for (var i = 0; i < app.project.sequences.numSequences; i++) {
						existingSeqIds[app.project.sequences[i].sequenceID] = true;
					}
					logFile.writeln("Existing sequences: " + app.project.sequences.numSequences);

					// Clone the sequence (doesn't return the new sequence)
					sourceSequence.clone();

					// Wait a moment for the clone to complete
					$.sleep(500);

					// Find the new sequence by looking for a sequenceID that didn't exist before
					var newSequence = null;
					for (var j = 0; j < app.project.sequences.numSequences; j++) {
						var seq = app.project.sequences[j];
						if (!existingSeqIds[seq.sequenceID]) {
							newSequence = seq;
							logFile.writeln("Found new sequence by ID: " + seq.name + " (ID: " + seq.sequenceID + ")");
							break;
						}
					}

					if (newSequence) {
						// Rename it - use custom name if provided, otherwise use default
						var newName = newSequenceName || (sourceSequence.name + "_cuts");
						newSequence.name = newName;
						logFile.writeln("Renamed to: " + newSequence.name);

						// Open the new sequence
						app.project.openSequence(newSequence.sequenceID);

						// Wait for sequence to open and become active
						$.sleep(300);

						// Verify we're now on the new sequence
						targetSequence = app.project.activeSequence;
						logFile.writeln("Active sequence after open: " + targetSequence.name);

						if (targetSequence.sequenceID === newSequence.sequenceID) {
							newSequenceCreatedActual = true;
							logFile.writeln("SUCCESS: Working on new sequence");
						} else {
							logFile.writeln("WARNING: Active sequence mismatch, forcing target");
							targetSequence = newSequence;
							newSequenceCreatedActual = true;
						}
					} else {
						logFile.writeln("WARNING: Could not find new sequence, using original");
					}
				} catch (cloneErr) {
					logFile.writeln("Clone error: " + cloneErr);
					logFile.writeln("Using original sequence instead");
				}
			}

			logFile.writeln("Target sequence: " + targetSequence.name);

			// Parse scenes array if it's a string
			var scenesArray = typeof scenes === 'string' ? JSON.parse(scenes) : scenes;
			if (!scenesArray || !scenesArray.length) {
				logFile.writeln("ERROR: No scenes provided");
				logFile.close();
				return { success: false, message: "No scenes provided" };
			}
			logFile.writeln("Total scenes: " + scenesArray.length);

			// Ticks per second constant
			var TICKS_PER_SECOND = 254016000000;

			// Collect unique cut times from scene boundaries
			var cutTimesMap = {};
			for (var i = 0; i < scenesArray.length; i++) {
				var scene = scenesArray[i];
				if (scene.startSec > 0.01) {
					cutTimesMap[Math.round(scene.startSec * 1000)] = scene.startSec;
				}
				cutTimesMap[Math.round(scene.endSec * 1000)] = scene.endSec;
			}

			var uniqueTimes = [];
			for (var key in cutTimesMap) {
				if (cutTimesMap.hasOwnProperty(key)) {
					uniqueTimes.push(cutTimesMap[key]);
				}
			}
			// Sort in DESCENDING order - process from end to start
			uniqueTimes.sort(function(a, b) { return b - a; });

			logFile.writeln("\n=== Unique Cut Times (descending) ===");
			logFile.writeln("Total: " + uniqueTimes.length);

			$._PPP_.updateEventPanel('Processing ' + uniqueTimes.length + ' cut points...');

			var numVideoTracks = targetSequence.videoTracks.numTracks;
			var numAudioTracks = targetSequence.audioTracks.numTracks;

			logFile.writeln("\n=== Track Info ===");
			logFile.writeln("Video tracks: " + numVideoTracks);
			logFile.writeln("Audio tracks: " + numAudioTracks);

			var successfulCuts = 0;
			var totalClipsSplit = 0;

			logFile.writeln("\n=== Starting Razor Cuts ===");

			// Process each cut time (from end to start)
			for (var c = 0; c < uniqueTimes.length; c++) {
				var cutTimeSec = uniqueTimes[c];
				var cutTimeTicks = Math.round(cutTimeSec * TICKS_PER_SECOND);
				logFile.writeln("\n--- Cut at " + cutTimeSec + "s ---");

				var cutsAtThisTime = 0;

				// Process video tracks
				for (var vt = 0; vt < numVideoTracks; vt++) {
					var videoTrack = targetSequence.videoTracks[vt];
					var numClips = videoTrack.clips.numItems;

					for (var ci = 0; ci < numClips; ci++) {
						var clip = videoTrack.clips[ci];
						if (!clip) continue;

						var clipStartTicks = parseInt(clip.start.ticks);
						var clipEndTicks = parseInt(clip.end.ticks);
						var margin = TICKS_PER_SECOND * 0.04; // ~1 frame at 24fps

						// Check if cut point is inside this clip
						if (cutTimeTicks > clipStartTicks + margin && cutTimeTicks < clipEndTicks - margin) {
							logFile.writeln("  V" + vt + " clip " + ci + ": splitting at " + cutTimeSec + "s");

							try {
								var projectItem = clip.projectItem;
								var inPointTicks = parseInt(clip.inPoint.ticks);
								var outPointTicks = parseInt(clip.outPoint.ticks);

								// Media time at cut point
								var mediaOffsetAtCut = inPointTicks + (cutTimeTicks - clipStartTicks);
								var originalEndTicks = clipEndTicks;
								var originalOutPointTicks = outPointTicks;

								// Convert to seconds for projectItem methods
								var mediaInSec = inPointTicks / TICKS_PER_SECOND;
								var mediaOutSec = originalOutPointTicks / TICKS_PER_SECOND;
								var mediaCutSec = mediaOffsetAtCut / TICKS_PER_SECOND;
								var secondPartDurationSec = (originalEndTicks - cutTimeTicks) / TICKS_PER_SECOND;

								logFile.writeln("    Original: " + (clipStartTicks/TICKS_PER_SECOND).toFixed(2) + "s - " + (clipEndTicks/TICKS_PER_SECOND).toFixed(2) + "s");
								logFile.writeln("    Media: " + mediaInSec.toFixed(2) + "s - " + mediaOutSec.toFixed(2) + "s");
								logFile.writeln("    Cut at media: " + mediaCutSec.toFixed(2) + "s");

								// 1. Trim the original clip to end at cut point
								var cutTime = new Time();
								cutTime.ticks = cutTimeTicks.toString();
								clip.end = cutTime;

								var newOutPoint = new Time();
								newOutPoint.ticks = mediaOffsetAtCut.toString();
								clip.outPoint = newOutPoint;

								logFile.writeln("    Trimmed first part end to: " + cutTimeSec + "s");

								// 2. Insert second part with constrained in/out on projectItem
								if (projectItem) {
									// Save original projectItem in/out
									var origProjIn = projectItem.getInPoint();
									var origProjOut = projectItem.getOutPoint();

									logFile.writeln("    ProjectItem original in/out: " + origProjIn.seconds + "s / " + origProjOut.seconds + "s");

									// Set projectItem in/out to just the second portion
									projectItem.setInPoint(mediaCutSec, 4); // 4 = updateUI
									projectItem.setOutPoint(mediaOutSec, 4);

									logFile.writeln("    Set projectItem in/out to: " + mediaCutSec.toFixed(2) + "s / " + mediaOutSec.toFixed(2) + "s");

									// Now overwriteClip will only insert the constrained portion
									videoTrack.overwriteClip(projectItem, cutTimeSec);

									logFile.writeln("    Inserted second part at: " + cutTimeSec + "s");

									// Restore original projectItem in/out
									projectItem.setInPoint(origProjIn.seconds, 4);
									projectItem.setOutPoint(origProjOut.seconds, 4);

									logFile.writeln("    Restored projectItem in/out");

									cutsAtThisTime++;
									totalClipsSplit++;
									logFile.writeln("    -> Split SUCCESS");
								} else {
									logFile.writeln("    -> No projectItem");
								}

							} catch (splitErr) {
								logFile.writeln("    -> Split failed: " + splitErr);
							}
						}
					}
				}

				// Process audio tracks
				for (var at = 0; at < numAudioTracks; at++) {
					var audioTrack = targetSequence.audioTracks[at];
					var numAudioClips = audioTrack.clips.numItems;

					for (var aci = 0; aci < numAudioClips; aci++) {
						var audioClip = audioTrack.clips[aci];
						if (!audioClip) continue;

						var aClipStartTicks = parseInt(audioClip.start.ticks);
						var aClipEndTicks = parseInt(audioClip.end.ticks);
						var margin = TICKS_PER_SECOND * 0.04;

						if (cutTimeTicks > aClipStartTicks + margin && cutTimeTicks < aClipEndTicks - margin) {
							logFile.writeln("  A" + at + " clip " + aci + ": splitting");

							try {
								var aProjectItem = audioClip.projectItem;
								var aInPointTicks = parseInt(audioClip.inPoint.ticks);
								var aOutPointTicks = parseInt(audioClip.outPoint.ticks);
								var aMediaOffsetAtCut = aInPointTicks + (cutTimeTicks - aClipStartTicks);
								var aOriginalEndTicks = aClipEndTicks;

								var aMediaCutSec = aMediaOffsetAtCut / TICKS_PER_SECOND;
								var aMediaOutSec = aOutPointTicks / TICKS_PER_SECOND;

								// Trim original
								var aCutTime = new Time();
								aCutTime.ticks = cutTimeTicks.toString();
								audioClip.end = aCutTime;

								var aNewOutPoint = new Time();
								aNewOutPoint.ticks = aMediaOffsetAtCut.toString();
								audioClip.outPoint = aNewOutPoint;

								// Insert second part
								if (aProjectItem) {
									var aOrigProjIn = aProjectItem.getInPoint();
									var aOrigProjOut = aProjectItem.getOutPoint();

									aProjectItem.setInPoint(aMediaCutSec, 4);
									aProjectItem.setOutPoint(aMediaOutSec, 4);

									audioTrack.overwriteClip(aProjectItem, cutTimeSec);

									aProjectItem.setInPoint(aOrigProjIn.seconds, 4);
									aProjectItem.setOutPoint(aOrigProjOut.seconds, 4);

									cutsAtThisTime++;
									totalClipsSplit++;
									logFile.writeln("    -> Split SUCCESS");
								}
							} catch (aSplitErr) {
								logFile.writeln("    -> Split failed: " + aSplitErr);
							}
						}
					}
				}

				if (cutsAtThisTime > 0) {
					successfulCuts++;
					logFile.writeln("Cut at " + cutTimeSec + "s: " + cutsAtThisTime + " clips split");
				}
			}

			// === Apply clip labels using the overwrite trick ===
			var labelsApplied = 0;

			if (applyLabels) {
				$._PPP_.updateEventPanel('Applying clip labels...');

				var labelIndexMap = {
					'NG': 6,        // Rose
					'A-roll': 13,   // Green
					'B-roll': 4,    // Cerulean
					'Insert': 3     // Lavender
				};

				logFile.writeln("\n=== Applying Clip Labels (Overwrite Method) ===");

				for (var si = 0; si < scenesArray.length; si++) {
				var scene = scenesArray[si];
				var classification = scene.classification;

				if (!classification || labelIndexMap[classification] === undefined) {
					continue;
				}

				var targetLabel = labelIndexMap[classification];
				var sceneStartTicks = Math.round(scene.startSec * TICKS_PER_SECOND);
				var sceneEndTicks = Math.round(scene.endSec * TICKS_PER_SECOND);
				var margin = TICKS_PER_SECOND * 0.1;

				logFile.writeln("\nScene " + (si + 1) + ": " + scene.startSec + "s - " + scene.endSec + "s, " + classification + " -> label " + targetLabel);

				// Process video tracks
				for (var vt = 0; vt < numVideoTracks; vt++) {
					var videoTrack = targetSequence.videoTracks[vt];
					var numClips = videoTrack.clips.numItems;

					for (var ci = 0; ci < numClips; ci++) {
						var clip = videoTrack.clips[ci];
						if (!clip || !clip.projectItem) continue;

						var clipStartTicks = parseInt(clip.start.ticks);

						if (clipStartTicks >= sceneStartTicks - margin && clipStartTicks < sceneEndTicks - margin) {
							try {
								var projectItem = clip.projectItem;
								var clipStartSec = clipStartTicks / TICKS_PER_SECOND;
								var clipInPointTicks = parseInt(clip.inPoint.ticks);
								var clipOutPointTicks = parseInt(clip.outPoint.ticks);

								// 1. Save original projectItem settings
								var origLabel = projectItem.getColorLabel();
								var origInPoint = projectItem.getInPoint();
								var origOutPoint = projectItem.getOutPoint();

								logFile.writeln("  V" + vt + " clip at " + clipStartSec.toFixed(2) + "s: origLabel=" + origLabel);

								// 2. Set projectItem to desired label and in/out range
								projectItem.setColorLabel(targetLabel);
								projectItem.setInPoint(clipInPointTicks / TICKS_PER_SECOND, 4);
								projectItem.setOutPoint(clipOutPointTicks / TICKS_PER_SECOND, 4);

								// 3. Overwrite at the same position (replaces with newly labeled clip)
								videoTrack.overwriteClip(projectItem, clipStartSec);

								// 4. Restore original projectItem settings
								projectItem.setColorLabel(origLabel);
								projectItem.setInPoint(origInPoint.seconds, 4);
								projectItem.setOutPoint(origOutPoint.seconds, 4);

								labelsApplied++;
								logFile.writeln("    -> Label applied: " + targetLabel);

							} catch (labelErr) {
								logFile.writeln("  V" + vt + " clip label error: " + labelErr);
							}
						}
					}
				}

				// Process audio tracks
				for (var at = 0; at < numAudioTracks; at++) {
					var audioTrack = targetSequence.audioTracks[at];
					var numAudioClips = audioTrack.clips.numItems;

					for (var aci = 0; aci < numAudioClips; aci++) {
						var audioClip = audioTrack.clips[aci];
						if (!audioClip || !audioClip.projectItem) continue;

						var aClipStartTicks = parseInt(audioClip.start.ticks);

						if (aClipStartTicks >= sceneStartTicks - margin && aClipStartTicks < sceneEndTicks - margin) {
							try {
								var aProjectItem = audioClip.projectItem;
								var aClipStartSec = aClipStartTicks / TICKS_PER_SECOND;
								var aClipInPointTicks = parseInt(audioClip.inPoint.ticks);
								var aClipOutPointTicks = parseInt(audioClip.outPoint.ticks);

								var aOrigLabel = aProjectItem.getColorLabel();
								var aOrigInPoint = aProjectItem.getInPoint();
								var aOrigOutPoint = aProjectItem.getOutPoint();

								aProjectItem.setColorLabel(targetLabel);
								aProjectItem.setInPoint(aClipInPointTicks / TICKS_PER_SECOND, 4);
								aProjectItem.setOutPoint(aClipOutPointTicks / TICKS_PER_SECOND, 4);

								audioTrack.overwriteClip(aProjectItem, aClipStartSec);

								aProjectItem.setColorLabel(aOrigLabel);
								aProjectItem.setInPoint(aOrigInPoint.seconds, 4);
								aProjectItem.setOutPoint(aOrigOutPoint.seconds, 4);

								labelsApplied++;
								logFile.writeln("  A" + at + " clip at " + aClipStartSec.toFixed(2) + "s -> label " + targetLabel);

							} catch (aLabelErr) {
								logFile.writeln("  A" + at + " clip label error: " + aLabelErr);
							}
						}
					}
				}
			}
			} // end if (applyLabels)

			// === Disable clips on non-selected tracks ===
			var clipsDisabled = 0;

			if (disableNonSelected) {
				$._PPP_.updateEventPanel('Disabling non-selected track clips...');

				logFile.writeln("\n=== Disabling Non-Selected Track Clips ===");

				for (var si = 0; si < scenesArray.length; si++) {
				var scene = scenesArray[si];
				var selectedTrack = scene.selectedTrack;

				// Skip if no selectedTrack specified
				if (selectedTrack === undefined || selectedTrack === null) {
					continue;
				}

				var sceneStartTicks = Math.round(scene.startSec * TICKS_PER_SECOND);
				var sceneEndTicks = Math.round(scene.endSec * TICKS_PER_SECOND);
				var margin = TICKS_PER_SECOND * 0.1;

				logFile.writeln("\nScene " + (si + 1) + ": " + scene.startSec + "s - " + scene.endSec + "s, selectedTrack: V" + selectedTrack);

				// Process all video tracks - disable clips NOT on the selected track
				for (var vt = 0; vt < numVideoTracks; vt++) {
					var videoTrack = targetSequence.videoTracks[vt];
					var numClips = videoTrack.clips.numItems;

					for (var ci = 0; ci < numClips; ci++) {
						var clip = videoTrack.clips[ci];
						if (!clip) continue;

						var clipStartTicks = parseInt(clip.start.ticks);

						// Check if clip is in this scene's time range
						if (clipStartTicks >= sceneStartTicks - margin && clipStartTicks < sceneEndTicks - margin) {
							// If this track is NOT the selected track, disable the clip
							if (vt !== selectedTrack) {
								try {
									clip.disabled = true;
									clipsDisabled++;
									logFile.writeln("  V" + vt + " clip at " + (clipStartTicks / TICKS_PER_SECOND).toFixed(2) + "s: DISABLED");
								} catch (disableErr) {
									logFile.writeln("  V" + vt + " clip disable error: " + disableErr);
								}
							} else {
								// Make sure selected track clip is enabled
								try {
									clip.disabled = false;
									logFile.writeln("  V" + vt + " clip at " + (clipStartTicks / TICKS_PER_SECOND).toFixed(2) + "s: ENABLED (selected)");
								} catch (enableErr) {
									logFile.writeln("  V" + vt + " clip enable error: " + enableErr);
								}
							}
						}
					}
				}

				// Also handle audio tracks - match with video track selection
				for (var at = 0; at < numAudioTracks; at++) {
					var audioTrack = targetSequence.audioTracks[at];
					var numAudioClips = audioTrack.clips.numItems;

					for (var aci = 0; aci < numAudioClips; aci++) {
						var audioClip = audioTrack.clips[aci];
						if (!audioClip) continue;

						var aClipStartTicks = parseInt(audioClip.start.ticks);

						if (aClipStartTicks >= sceneStartTicks - margin && aClipStartTicks < sceneEndTicks - margin) {
							// Match audio track disable with video track selection
							if (at !== selectedTrack) {
								try {
									audioClip.disabled = true;
									clipsDisabled++;
									logFile.writeln("  A" + at + " clip at " + (aClipStartTicks / TICKS_PER_SECOND).toFixed(2) + "s: DISABLED");
								} catch (aDisableErr) {
									logFile.writeln("  A" + at + " clip disable error: " + aDisableErr);
								}
							} else {
								try {
									audioClip.disabled = false;
									logFile.writeln("  A" + at + " clip at " + (aClipStartTicks / TICKS_PER_SECOND).toFixed(2) + "s: ENABLED (selected)");
								} catch (aEnableErr) {
									logFile.writeln("  A" + at + " clip enable error: " + aEnableErr);
								}
							}
						}
					}
				}
			}
			} // end if (disableNonSelected)

			$._PPP_.updateEventPanel('Done! Split ' + totalClipsSplit + ' clips, labeled ' + labelsApplied + ', disabled ' + clipsDisabled + ' clips.');

			logFile.writeln("\n=== Result ===");
			logFile.writeln("Labels applied: " + labelsApplied);
			logFile.writeln("Clips disabled: " + clipsDisabled);
			logFile.writeln("Cut points processed: " + uniqueTimes.length);
			logFile.writeln("Successful cut points: " + successfulCuts);
			logFile.writeln("Total clips split: " + totalClipsSplit);
			logFile.writeln("New sequence created: " + createNewSequence);
			logFile.close();

			return {
				success: true,
				message: "Split " + totalClipsSplit + " clips at " + successfulCuts + " cut points.",
				totalCuts: uniqueTimes.length,
				successfulCuts: successfulCuts,
				clipsSplit: totalClipsSplit,
				labelsApplied: labelsApplied,
				clipsDisabled: clipsDisabled,
				newSequenceCreated: newSequenceCreatedActual
			};

		} catch (e) {
			$.writeln("[razorActiveSequenceAtSceneBoundaries] Error: " + e);
			$._PPP_.updateEventPanel('Error applying cuts: ' + e.toString());

			try {
				if (logFile) {
					logFile.writeln("\n=== EXCEPTION ===");
					logFile.writeln("Error: " + e);
					logFile.writeln("Line: " + (e.line || "unknown"));
					logFile.close();
				}
			} catch (logErr) {}

			return {
				success: false,
				message: "Error: " + e.toString()
			};
		}
	}
};

// Export the $._PPP_ object for TypeScript module system
// This allows index.ts to import and assign it to host[ns]
$._PPP_;// ---------------------------------- //// ----- EXTENDSCRIPT PONYFILLS -----function __objectFreeze(obj) { return obj; }// ---------------------------------- //var config = {
  id: "com.lasker.studio.cep"};

var ns = config.id;

var helloVoid = function helloVoid() {
  alert("test");
};
var helloError = function helloError(str) {
  // Intentional Error for Error Handling Demonstration
  
  throw new Error("We're throwing an error");
};
var helloStr = function helloStr(str) {
  alert("ExtendScript received a string: ".concat(str));
  return str;
};
var helloNum = function helloNum(n) {
  alert("ExtendScript received a number: ".concat(n.toString()));
  return n;
};
var helloArrayStr = function helloArrayStr(arr) {
  alert("ExtendScript received an array of ".concat(arr.length, " strings: ").concat(arr.toString()));
  return arr;
};
var helloObj = function helloObj(obj) {
  alert("ExtendScript received an object: ".concat(JSON.stringify(obj)));
  return {
    y: obj.height,
    x: obj.width
  };
};

var qeDomFunction = function qeDomFunction() {
  if (typeof qe === "undefined") {
    app.enableQE();
  }
  if (qe) {
    qe.name;
    qe.project.getVideoEffectByName("test");
  }
};
var helloWorld = function helloWorld() {
  alert("Hello from Premiere Pro.");
};
var safeGetValue = function safeGetValue(value) {
  return $._PPP_.safeGetValue(value);
};
var tickToObj = function tickToObj(t) {
  return $._PPP_.tickToObj(t);
};
var projectItemToSource = function projectItemToSource(projectItem, preferProxy) {
  return $._PPP_.projectItemToSource(projectItem, preferProxy);
};
var dumpTrackItems = function dumpTrackItems(track) {
  return $._PPP_.dumpTrackItems(track);
};
var getActiveSequenceName = function getActiveSequenceName() {
  return $._PPP_.getActiveSequenceName();
};
var getProjectSequences = function getProjectSequences() {
  return $._PPP_.getProjectSequences();
};
var getProjectSequencesSimple = function getProjectSequencesSimple() {
  return $._PPP_.getProjectSequencesSimple();
};
var getSequenceSnapshot = function getSequenceSnapshot(sequenceId) {
  return $._PPP_.getSequenceSnapshot(sequenceId);
};
var getSequenceSnapshotFromSequence = function getSequenceSnapshotFromSequence(sequence) {
  return $._PPP_.getSequenceSnapshotFromSequence(sequence);
};
var exportSequenceData = function exportSequenceData(sequenceId) {
  return $._PPP_.exportSequenceData(sequenceId);
};
var exportActiveSequenceData = function exportActiveSequenceData() {
  return $._PPP_.exportActiveSequenceData();
};
var generateSequenceThumbnail = function generateSequenceThumbnail(sequenceId, timestamp) {
  return $._PPP_.generateSequenceThumbnail(sequenceId, timestamp);
};
var getMediaFilePaths = function getMediaFilePaths(sequenceCreateData, uploadUrls) {
  return $._PPP_.getMediaFilePaths(sequenceCreateData, uploadUrls);
};
var navigateToTime = function navigateToTime(sequenceId, timeInSeconds) {
  return $._PPP_.navigateToTime(sequenceId, timeInSeconds);
};
var navigateActiveSequenceToTime = function navigateActiveSequenceToTime(timeInSeconds) {
  return $._PPP_.navigateActiveSequenceToTime(timeInSeconds);
};
var applySBDCutsToSequence = function applySBDCutsToSequence(sequenceId, scenes) {
  return $._PPP_.applySBDCutsToSequence(sequenceId, scenes);
};
var applyCutsToSequence = function applyCutsToSequence(sequenceId, cuts) {
  return $._PPP_.applyCutsToSequence(sequenceId, cuts);
};
var razorActiveSequenceAtSceneBoundaries = function razorActiveSequenceAtSceneBoundaries(scenes, options) {
  return $._PPP_.razorActiveSequenceAtSceneBoundaries(scenes, options || {});
};

var ppro = /*#__PURE__*/__objectFreeze({
  __proto__: null,
  applyCutsToSequence: applyCutsToSequence,
  applySBDCutsToSequence: applySBDCutsToSequence,
  dumpTrackItems: dumpTrackItems,
  exportActiveSequenceData: exportActiveSequenceData,
  exportSequenceData: exportSequenceData,
  generateSequenceThumbnail: generateSequenceThumbnail,
  getActiveSequenceName: getActiveSequenceName,
  getMediaFilePaths: getMediaFilePaths,
  getProjectSequences: getProjectSequences,
  getProjectSequencesSimple: getProjectSequencesSimple,
  getSequenceSnapshot: getSequenceSnapshot,
  getSequenceSnapshotFromSequence: getSequenceSnapshotFromSequence,
  helloArrayStr: helloArrayStr,
  helloError: helloError,
  helloNum: helloNum,
  helloObj: helloObj,
  helloStr: helloStr,
  helloVoid: helloVoid,
  helloWorld: helloWorld,
  navigateActiveSequenceToTime: navigateActiveSequenceToTime,
  navigateToTime: navigateToTime,
  projectItemToSource: projectItemToSource,
  qeDomFunction: qeDomFunction,
  razorActiveSequenceAtSceneBoundaries: razorActiveSequenceAtSceneBoundaries,
  safeGetValue: safeGetValue,
  tickToObj: tickToObj
});

var host = typeof $ !== "undefined" ? $ : window;

// A safe way to get the app name since some versions of Adobe Apps broken BridgeTalk in various places (e.g. After Effects 24-25)
// in that case we have to do various checks per app to deterimine the app name

var getAppNameSafely = function getAppNameSafely() {
  var compare = function compare(a, b) {
    return a.toLowerCase().indexOf(b.toLowerCase()) > -1;
  };
  var exists = function exists(a) {
    return typeof a !== "undefined";
  };
  var isBridgeTalkWorking = typeof BridgeTalk !== "undefined" && typeof BridgeTalk.appName !== "undefined";
  if (isBridgeTalkWorking) {
    return BridgeTalk.appName;
  } else if (app) {
    
    if (exists(app.name)) {
      
      var name = app.name;
      if (compare(name, "photoshop")) return "photoshop";
      if (compare(name, "illustrator")) return "illustrator";
      if (compare(name, "audition")) return "audition";
      if (compare(name, "bridge")) return "bridge";
      if (compare(name, "indesign")) return "indesign";
    }
    
    if (exists(app.appName)) {
      
      var appName = app.appName;
      if (compare(appName, "after effects")) return "aftereffects";
      if (compare(appName, "animate")) return "animate";
    }
    
    if (exists(app.path)) {
      
      var path = app.path;
      if (compare(path, "premiere")) return "premierepro";
    }
    
    if (exists(app.getEncoderHost) && exists(AMEFrontendEvent)) {
      return "ame";
    }
  }
  return "unknown";
};
switch (getAppNameSafely()) {
  case "premierepro":
  case "premiereprobeta":
    host[ns] = ppro;
    break;
}
// prettier-ignore

// https://extendscript.docsforadobe.dev/interapplication-communication/bridgetalk-class.html?highlight=bridgetalk#appname
})(this);