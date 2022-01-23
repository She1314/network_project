import json

from django.shortcuts import render
from django.views import View
from utils.VerifyUtil import VerifyParam
from utils.resFormatutil import JsonFormatUtil, ImageVerifyUtil
from WestReservoir.models import HruModel, SubModel, LandType, RchModel
from django.core import serializers
from django.utils.decorators import method_decorator
from django.views.decorators.cache import cache_page


class HruView(View):
    # @method_decorator(decorator=cache_page(10 * 60, cache="Hotspot"))
    def get(self, request):
        # 水库的id
        print("查询数据库")
        reservoir = HruModel.objects.all()
        reservoir_dict = json.loads(serializers.serialize(format='json', queryset=reservoir, ensure_ascii=False))
        sub_reservoir = SubModel.objects.all()
        sub_dict = json.loads(serializers.serialize(format='json', queryset=sub_reservoir, ensure_ascii=False))
        data_list = []
        mons = list(set([i['fields']['MON'] for i in reservoir_dict]))
        for sub_mon in mons:
            PET = [i['fields']['PETmm'] for i in reservoir_dict if i['fields']['MON'] == sub_mon]
            ET = [i['fields']['ETmm'] for i in reservoir_dict if i['fields']['MON'] == sub_mon]
            SURQmm = [i['fields']['SURQmm'] for i in sub_dict if i['fields']['MON'] == sub_mon]
            GW_Qmm = [i['fields']['GW_Qmm'] for i in sub_dict if i['fields']['MON'] == sub_mon]
            SURQ = sum(SURQmm) / len(SURQmm)
            GW_Q = sum(GW_Qmm) / len(SURQmm)
            PET = sum(PET) / len(PET)
            ET = sum(ET) / len(ET)
            data_list += [
                {"SURQmm": round(SURQ, 2), "GW_Qmm": round(GW_Q, 2), "PETmm": round(PET, 2), "ETmm": round(ET, 2)}]
        # HRU集水面积(km2)
        water_Area = sum([i['fields']['AREAkm2'] for i in reservoir_dict])
        # 子流域面积(km2)
        AREA = sum([i['fields']['AREAkm2'] for i in sub_dict])
        Sub_watershed = len([i for i in sub_dict])
        max_Sub_watershed = max([i['fields']['AREAkm2'] for i in sub_dict])
        SOLAR = sum([i['fields']['SOLARmj_m2'] for i in reservoir_dict]) / len(
            [i['fields']['SOLARmj_m2'] for i in reservoir_dict])
        SOL_TMP = sum([i['fields']['SOL_TMPdgC'] for i in reservoir_dict]) / len(
            [i['fields']['SOL_TMPdgC'] for i in reservoir_dict])
        # 可溶磷总量(kg P/ha)
        SOLPkg_ha = sum([i['fields']['SOLPkg_ha'] for i in sub_dict])
        # 矿物质磷总量
        SEDPkg_ha = sum([i['fields']['SEDPkg_ha'] for i in sub_dict])
        data_list += [
            {"water_Area": round(water_Area, 2), "AREA": round(AREA, 2), "Sub_watershed": Sub_watershed
                , "max_Sub_watershed": round(max_Sub_watershed, 2), "SOLARmj_m2": round(SOLAR, 2),
             "SOL_TMP": round(SOL_TMP, 2), "SOLPkg_ha": round(SOLPkg_ha, 2), "SEDPkg_ha": round(SEDPkg_ha, 2)
             }]
        return JsonFormatUtil(data=data_list).parseJson()


class LandUseCView(View):
    def get(self, request):
        land_data = LandType.objects.all()
        land_data_dict = json.loads(serializers.serialize(format='json', queryset=land_data, ensure_ascii=False))
        # land_data_dict = [{"value": i['fields']['Count'], "name": i['fields']['Type']} for i in land_data_dict]
        year_list = [2000, 2010, 2020]
        land_data_dict = [{"value": i['fields']['Count'], "name": i['fields']['Type']} for i in land_data_dict]
        return JsonFormatUtil(data=land_data_dict).parseJson()


class PrecipitationView(View):
    def get(self, request):
        Precipitation = SubModel.objects.all()
        Precipitation_dict = json.loads(
            serializers.serialize(format='json', queryset=Precipitation, ensure_ascii=False))
        data_list = []
        mons = list(set([i['fields']['MON'] for i in Precipitation_dict]))
        for sub_mon in mons:
            PRECIP = [i['fields']['PETmm'] for i in Precipitation_dict if i['fields']['MON'] == sub_mon]
            PRECIPmm = sum(PRECIP) / len(PRECIP)
            data_list += [
                {"PRECIPmm": round(PRECIPmm, 2), "mouth": sub_mon}]
        return JsonFormatUtil(data=data_list).parseJson()


class NutrientOutPutView(View):
    # @method_decorator(decorator=cache_page(10 * 60, cache="Hotspot"))
    def get(self, request):
        sub_reservoir = SubModel.objects.all()
        reservoir = HruModel.objects.all()
        reservoir_dict = json.loads(serializers.serialize(format='json', queryset=reservoir, ensure_ascii=False))
        sub_reservoir_dict = json.loads(
            serializers.serialize(format='json', queryset=sub_reservoir, ensure_ascii=False))
        data_list = []
        mons = list(set([i['fields']['MON'] for i in sub_reservoir_dict]))
        for sub_mon in mons:
            ORGNkg_ha = sum(
                [i['fields']['ORGNkg_ha'] for i in sub_reservoir_dict if i['fields']['MON'] == sub_mon]) / len(
                [i['fields']['ORGNkg_ha'] for i in sub_reservoir_dict if i['fields']['MON'] == sub_mon])
            ORGPhg_ha = sum(
                [i['fields']['ORGPhg_ha'] for i in sub_reservoir_dict if i['fields']['MON'] == sub_mon]) / len(
                [i['fields']['ORGPhg_ha'] for i in sub_reservoir_dict if i['fields']['MON'] == sub_mon])
            SW_ENDmm = sum(
                [i['fields']['SW_ENDmm'] for i in reservoir_dict if i['fields']['MON'] == sub_mon]) / len(
                [i['fields']['SW_ENDmm'] for i in reservoir_dict if i['fields']['MON'] == sub_mon])
            SA_STmm = sum(
                [i['fields']['SA_STmm'] for i in reservoir_dict if i['fields']['MON'] == sub_mon]) / len(
                [i['fields']['SA_STmm'] for i in reservoir_dict if i['fields']['MON'] == sub_mon])
            WYLDmm = sum(
                [i['fields']['WYLDmm'] for i in sub_reservoir_dict if i['fields']['MON'] == sub_mon]) / len(
                [i['fields']['WYLDmm'] for i in sub_reservoir_dict if i['fields']['MON'] == sub_mon])
            SYLDt_ha = sum(
                [i['fields']['SYLDt_ha'] for i in sub_reservoir_dict if i['fields']['MON'] == sub_mon]) / len(
                [i['fields']['SYLDt_ha'] for i in sub_reservoir_dict if i['fields']['MON'] == sub_mon])

            data_list += [
                {'ORGNkg_ha': round(ORGNkg_ha, 2), "ORGPkg_ha": round(ORGPhg_ha, 2), "SW_ENDmm": round(SW_ENDmm, 2),
                 "SA_STmm": round(SA_STmm, 2), "WYLDmm": round(WYLDmm, 2), "SYLDt_ha": round(SYLDt_ha, 2),
                 "mons": sub_mon}]
        return JsonFormatUtil(data=data_list).parseJson()


class RchView(View):
    def get(self, request):
        # print(reservoir_id)
        rch_sha = RchModel.objects.filter(MON=7)
        rch_sha_dict = json.loads(serializers.serialize(format='json', queryset=rch_sha, ensure_ascii=False))
        data_list = [{'SUB': i["fields"]["SUB"],
                      'FLOW_INcms': i['fields']['FLOW_INcms'],
                      "FLOW_OUTcms": i['fields']['FLOW_OUTcms'],
                      "ORGN_INkg": i['fields']['ORGN_INkg'],
                      "ORGN_OUTkg": i['fields']['ORGN_OUTkg'],
                      } for i in
                     rch_sha_dict]
        return JsonFormatUtil(data=data_list).parseJson()


class SubViewJuly(View):
    def get(self, request):
        July_Sub = SubModel.objects.filter(MON=7)
        rch_sha_dict = json.loads(serializers.serialize(format='json', queryset=July_Sub, ensure_ascii=False))
        # print(type(rch_sha_dict))
        rch_sha_dict = [
            {"name": i["fields"]["SUB"], "value": i["fields"]["AREAkm2"],
             "text": f"Hru面积为{i['fields']['AREAkm2']}km2"} for
            i in rch_sha_dict]
        return JsonFormatUtil(data=rch_sha_dict).parseJson()


class MouOutPut(View):
    def get(self, request):
        rch_sha = RchModel.objects.all()

        rch_sha_dict = json.loads(serializers.serialize(format='json', queryset=rch_sha, ensure_ascii=False))
        mons = list(set([i['fields']['MON'] for i in rch_sha_dict]))
        data_list = []
        for sub_mon in mons:
            print(sub_mon)
            MOU_ORGN_IN = sum([i['fields']['ORGN_INkg'] for i in rch_sha_dict if i['fields']['MON'] == sub_mon])
            MOU_NO3_IN = sum([i['fields']['NO3_INkg'] for i in rch_sha_dict if i['fields']['MON'] == sub_mon])
            MOU_NH4_IN = sum([i['fields']['NH4_INkg'] for i in rch_sha_dict if i['fields']['MON'] == sub_mon])
            MOU_NO2_IN = sum([i['fields']['NO2_INkg'] for i in rch_sha_dict if i['fields']['MON'] == sub_mon])
            MOU_CBOD_IN = sum([i['fields']['CBOD_INkg'] for i in rch_sha_dict if i['fields']['MON'] == sub_mon])
            data_list += [{f"{sub_mon}": {"有机氮(T)": round(MOU_ORGN_IN / 1000, 0),
                                          "硝酸盐(T)": round(MOU_NO3_IN / 1000, 0),
                                          "氨氮(T)": round(MOU_NH4_IN / 1000, 0),
                                          "生化需氧量(10/T)": round(MOU_CBOD_IN / 10000, 0),
                                          "亚硝酸盐(kg)": round(MOU_NO2_IN, 0),
                                          }}]
        return JsonFormatUtil(data=data_list).parseJson()
