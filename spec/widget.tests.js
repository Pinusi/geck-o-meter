var expect = chai.expect;

describe('GEOM', function() {

	//stubs and spies
	// sinon.spy(window, 'Snap');
	// var getDataManager_stub = sinon.stub( GG.MONDELEZTREATS.main.prototype, 'getDataManager').returns(0);
	// var dataReceivedHandler_stub = sinon.stub( GG.MONDELEZTREATS.main.prototype, 'dataReceivedHandler').returns(0);

	//object
	var widget_data = {
			min: 112, 
			value: 212, 
			max: 750
		},
		widget_container = $("<div id='widget'></div>"),
		widget;

	function initWidget(){
		widget = new GEOM.Widget( widget_container, widget_data );
	}

	describe('Widget', function () {
		beforeEach(function(){
			initWidget();
		});
		it('should have a container', function ( done ) {
			expect(widget.$container).to.have.length(1);
			done();
		});
		it('should have some data and to contain min, max and value', function ( done ) {
			expect(widget.data).to.exist;
			expect(widget.data).to.have.all.keys('min', 'max', 'value');
			done();
		});
	});

	describe('calculatePercent', function () {
		beforeEach(function(){
			initWidget();
		});
		it('it should calculate correctly the percentage', function ( done ) {
			var percentage = (widget_data.value - widget_data.min)/(widget_data.max - widget_data.min)
			expect( widget.calculatePercent() ).to.equal(percentage);
			done();
		});
		it('it should return 0 if min > max', function ( done ) {
			widget.data.min = 1000;
			expect( widget.calculatePercent() ).to.equal(0);
			done();
		});
		it('it should return 0 if min > value', function ( done ) {
			expect( widget.calculatePercent() ).to.equal(0);
			done();
		});
		it('it should return 1 if value > max', function ( done ) {
			widget.data.min = 112;
			widget.data.value = 800;
			expect( widget.calculatePercent() ).to.equal(1);
			done();
		});
	});

	describe('animateTick', function () {
		beforeEach(function(){
			initWidget();
		});
		it('it shoudl calculate correctly the endpoint', function ( done ) {
			expect( widget.animateTick( 0.3 ) ).to.equal( 0.3 * ( 66 * 2 ) - 66);
			done();
		});
	});

	describe('animateArc', function () {
		beforeEach(function(){
			initWidget();
		});
		it('it shoudl calculate correctly the endpoint', function ( done ) {
			expect( widget.animateArc( 0.3 ) ).to.equal( 0.3 * 180 - 90);
			done();
		});
	});
});