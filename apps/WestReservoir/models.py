from django.db import models


# Create your models here.
class HruModel(models.Model):
    LULC = models.CharField(max_length=30, verbose_name='土地类别')
    HRU = models.IntegerField(verbose_name='子流域')
    HRUGIS = models.CharField(max_length=50, verbose_name='子流域代号')
    SUB = models.SmallIntegerField(verbose_name='所属的子流域')
    YEAR = models.IntegerField(verbose_name='年份')
    MON = models.IntegerField(verbose_name='月份')
    AREAkm2 = models.FloatField(max_length=20, verbose_name='HRU集水面积(km2)')
    PRECIPmm = models.FloatField(max_length=20, verbose_name='HRU内的总降水')
    PETmm = models.FloatField(max_length=20, verbose_name='长HRU内的潜在蒸散发')
    ETmm = models.FloatField(max_length=20, verbose_name='HRU内的实际蒸散发')
    SW_INITmm = models.FloatField(max_length=20, verbose_name='土壤水含量')
    SW_ENDmm = models.FloatField(max_length=20, verbose_name='土壤水含量最后的土壤剖面的水量')
    PERCmm = models.FloatField(max_length=20, verbose_name='通过根部区域渗漏的水量')
    SA_STmm = models.FloatField(max_length=20, verbose_name='最后的潜水层水储量')
    DA_STmm = models.FloatField(max_length=20, verbose_name='最后的深层含水层水储量')
    TMP_AVdgC = models.FloatField(max_length=20, verbose_name='每日平均气温')
    TMP_MXdgC = models.FloatField(max_length=20, verbose_name='最后的潜水层水储量')
    TMP_MNdgC = models.FloatField(max_length=20, verbose_name='最后的潜水层水储量')
    SOL_TMPdgC = models.FloatField(max_length=20, verbose_name='第一层土壤的平均温度')
    SOLARmj_m2 = models.FloatField(max_length=20, verbose_name='每日太阳辐射值')
    YYYYMM = models.CharField(max_length=20, verbose_name='HRU编号')

    class Meta:
        db_table = 'hru_chenxi'


class SubModel(models.Model):
    SUB = models.SmallIntegerField(verbose_name='子流域编号')
    YEAR = models.IntegerField(verbose_name='年份')
    MON = models.SmallIntegerField(verbose_name='月份')
    AREAkm2 = models.FloatField(verbose_name='子流域面积', max_length=20)
    PRECIPmm = models.FloatField(verbose_name='子流域内的总降水')
    SNOWMELTmm = models.FloatField(verbose_name='冰雪融化量')
    PETmm = models.FloatField(verbose_name='子流域内的潜在蒸散发')
    ETmm = models.FloatField(verbose_name='实际蒸散发')
    SWmm = models.FloatField(verbose_name='土壤水含量')
    PERCmm = models.FloatField(verbose_name='通过根部区域渗漏的水量')
    SURQmm = models.FloatField(verbose_name='地表径流对主河道总径流的贡献量')
    GW_Qmm = models.FloatField(verbose_name='地下径流对主河道总径流的贡献量')
    WYLDmm = models.FloatField(verbose_name='子流域进入主河道的总水量')
    SYLDt_ha = models.FloatField(verbose_name='从子流域进入主河道的总泥沙量')
    ORGNkg_ha = models.FloatField(verbose_name='有机氮总量(kgN/ha)')
    ORGPhg_ha = models.FloatField(verbose_name='有机磷总量(kgP/ha)')
    NSURQkg_ha = models.FloatField(verbose_name='随地表径流进入河道的NO3量')
    SOLPkg_ha = models.FloatField(verbose_name='可溶磷总量(kgP/ha)')
    SEDPkg_ha = models.FloatField(verbose_name='随泥沙进入河道的矿物质磷总量')
    YYYYMM = models.CharField(max_length=20, verbose_name='HRU编号')

    class Meta:
        db_table = 'sub_chenxi'


class LandType(models.Model):
    Value = models.SmallIntegerField(verbose_name='代号')
    Count = models.IntegerField(verbose_name='数量')
    Type = models.CharField(max_length=20, verbose_name='土地类别')
    Year = models.IntegerField(verbose_name='年份', default=None)

    class Meta:
        db_table = 'land_type_chenxi'


#  主河道rch输出文件
class RchModel(models.Model):
    SUB = models.SmallIntegerField(verbose_name='子流域编号')
    YEAR = models.IntegerField(verbose_name='年份')
    MON = models.SmallIntegerField(verbose_name='月份')
    AREAkm2 = models.FloatField(verbose_name='河段集水面积', max_length=20)
    FLOW_INcms = models.FloatField(verbose_name='流入河段的平均每日径流')
    FLOW_OUTcms = models.FloatField(verbose_name='流出河段的平均每日径流')
    EVAPcms = models.FloatField(verbose_name='平均每日蒸发损失')
    TLOSScms = models.FloatField(verbose_name='平均每日河床传输损失')
    SED_INtons = models.FloatField(verbose_name='进入河段的泥沙量')
    SED_OUTtons = models.FloatField(verbose_name='流出河段的泥沙量')
    SEDCONCmg_kg = models.FloatField(verbose_name='河段中泥沙浓度')
    ORGN_INkg = models.FloatField(verbose_name='进入河段的有机氮总量')
    ORGN_OUTkg = models.FloatField(verbose_name='流出河段的有机氮总量')
    ORGP_INkg = models.FloatField(verbose_name='进入河段的有机磷总量')
    ORGP_OUTkg = models.FloatField(verbose_name='流出河段的有机磷总量')
    NO3_INkg = models.FloatField(verbose_name='进入河段的硝酸盐总量')
    NO3_OUTkg = models.FloatField(verbose_name='流出河段的硝酸盐总量')
    NH4_INkg = models.FloatField(verbose_name='进入河段的氨氮总量')
    NH4_OUTkg = models.FloatField(verbose_name='流出河段的氨氮总量')
    NO2_INkg = models.FloatField(verbose_name='进入河段的亚硝酸盐总量')
    NO2_OUTkg = models.FloatField(verbose_name='流出河段的亚硝酸盐总量')
    MINP_INkg = models.FloatField(verbose_name='进入河段的矿物质磷总量')
    MINP_OUTkg = models.FloatField(verbose_name='流出河段的矿物质磷总量')
    CHLA_INkg = models.FloatField(verbose_name='叶绿素a被输送到水库的量')
    CHLA_OUTkg = models.FloatField(verbose_name='输送出的叶绿素a量')
    CBOD_INkg = models.FloatField(verbose_name='进入河段的物质的碳质生化需氧量')
    CBOD_OUTkg = models.FloatField(verbose_name='流出河段的物质的碳质生化需氧量')
    DISOX_INkg = models.FloatField(verbose_name='进入河段的溶解氧')
    DISOX_OUTkg = models.FloatField(verbose_name='流出河段的溶解氧', max_length=20)
    YYYYMM = models.CharField(verbose_name='HRU编号', max_length=20)

    class Meta:
        db_table = 'rch_chenxi'
