import Foundation
import Vision
import AppKit
import CoreImage
let context = CIContext()
for path in CommandLine.arguments.dropFirst() {
 let url=URL(fileURLWithPath:path)
 guard let image=CIImage(contentsOf:url), let cg=context.createCGImage(image,from:image.extent) else {continue}
 let request=VNGeneratePersonSegmentationRequest()
 request.qualityLevel = .accurate
 request.outputPixelFormat = kCVPixelFormatType_OneComponent8
 try VNImageRequestHandler(cgImage:cg).perform([request])
 guard let buffer=request.results?.first?.pixelBuffer else {continue}
 let mask=CIImage(cvPixelBuffer:buffer)
 let scaled=mask.transformed(by:CGAffineTransform(scaleX:image.extent.width/mask.extent.width,y:image.extent.height/mask.extent.height))
 let clear=CIImage(color:CIColor.clear).cropped(to:image.extent)
 let out=image.applyingFilter("CIBlendWithMask",parameters:[kCIInputBackgroundImageKey:clear,kCIInputMaskImageKey:scaled])
 let dest=url.deletingPathExtension().appendingPathExtension("png")
 try context.writePNGRepresentation(of:out,to:dest,format:.RGBA8,colorSpace:CGColorSpaceCreateDeviceRGB())
 print(dest.path)
}
