import {assert} from './test-util.js'
import {getFile, getPath, isNode, isBrowser} from './test-util.js'
import {Exifr} from '../src/bundle-full.js'
import * as exifr from '../src/bundle-full.js'


describe('thumbnail', () => {

	let fileName = 'img_1771.jpg'

    let options = {
        thumbnail: true,
        mergeOutput: false,
    }

	function assertThumbnailData(thumb) {
		// jpeg
		assert.equal(thumb[0], 0xff)
		assert.equal(thumb[1], 0xd8)
		// thumbnail data
		assert.equal(thumb[2], 0xff)
		assert.equal(thumb[3], 0xdb)
		assert.equal(thumb[4], 0x00)
		assert.equal(thumb[5], 0x84)
		assert.equal(thumb[6], 0x00)
    }

	function assertThumbnailLength(thumb) {
		assert.equal(thumb.byteLength, 5448)
	}

	describe('Exifr#extractThumbnail()', () => {

		it(`returns instance of Uint8Array of thumbnail (on all platforms)`, async () => {
			let input = await getFile(fileName)
			let exr = new Exifr(options)
			await exr.read(input)
			var thumb = await exr.extractThumbnail()
			assert.instanceOf(thumb, Uint8Array)
		})

		it(`returns correct thumbnail data`, async () => {
			let input = await getFile(fileName)
			let exr = new Exifr(options)
			await exr.read(input)
			var thumb = await exr.extractThumbnail()
			assertThumbnailData(thumb)
		})

		it(`returns thumbnail of correct length`, async () => {
			let input = await getFile(fileName)
			let exr = new Exifr(options)
			await exr.read(input)
			var thumb = await exr.extractThumbnail()
			assertThumbnailLength(thumb)
		})

		it(`returns thumbnail (forced after mergeOutput)`, async () => {
			let input = await getFile(fileName)
			let exr = new Exifr({mergeOutput: true})
			await exr.read(input)
			var thumb = await exr.extractThumbnail()
			assertThumbnailData(thumb)
			assertThumbnailLength(thumb)
		})

		it(`returns thumbnail (default)`, async () => {
			let input = await getFile(fileName)
			let exr = new Exifr()
			await exr.read(input)
			var thumb = await exr.extractThumbnail()
			assertThumbnailData(thumb)
			assertThumbnailLength(thumb)
		})

		it(`returns undefined if there's no exif`, async () => {
			let input = await getFile('img_1771_no_exif.jpg')
			let exr = new Exifr()
			await exr.read(input)
			var thumb = await exr.extractThumbnail()
			assert.isUndefined(thumb)
		})

		it(`returns undefined if there's no exif 2`, async () => {
			let input = await getFile('noexif.jpg')
			let exr = new Exifr()
			await exr.read(input)
			var thumb = await exr.extractThumbnail()
			assert.isUndefined(thumb)
		})

		it(`returns undefined if there's no thumbnail`, async () => {
			let input = await getFile('PANO_20180714_121453.jpg')
			let exr = new Exifr()
			await exr.read(input)
			var thumb = await exr.extractThumbnail()
			assert.isUndefined(thumb)
		})

    })

    describe(`exifr.thumbnail()`, async () => {

		it(`returns thumbnail`, async () => {
			let input = await getFile(fileName)
			var thumb = await exifr.thumbnail(input, options)
			assertThumbnailData(thumb)
			assertThumbnailLength(thumb)
		})

		isBrowser && it(`returns Uint8Array in browser`, async () => {
			let input = await getFile(fileName)
			var thumb = await exifr.thumbnail(input, options)
			assert.instanceOf(thumb, Uint8Array)
		})

		isNode && it(`returns Buffer in node`, async () => {
			let input = await getFile(fileName)
			var thumb = await exifr.thumbnail(input, options)
			assert.instanceOf(thumb, Buffer)
		})

    })

    isBrowser && describe(`exifr.thumbnailUrl()`, async () => {

		it(`returns string url`, async () => {
			let input = await getFile(fileName)
			var url = await exifr.thumbnailUrl(input, options)
			assert.typeOf(url, 'string')
			assert.isTrue(url.startsWith('blob:http'))
		})

    })

})
